"""
Unified preprocessing pipeline for Plant Disease Detection.
This module ensures identical preprocessing for both training and inference.
"""

import cv2
import numpy as np
from skimage.feature import graycomatrix, graycoprops, local_binary_pattern


# Configuration constants (must match training)
IMG_SIZE = (224, 224)
N_BINS_RGB = 16
N_BINS_H = 18


def preprocess_image(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """
    Apply the full preprocessing pipeline to an RGB image.
    
    Parameters
    ----------
    rgb : np.ndarray
        Input RGB image (any size)
    
    Returns
    -------
    resized : (224,224,3) uint8 RGB
    hsv : (224,224,3) uint8 HSV
    clahe_hsv : (224,224,3) uint8 HSV with CLAHE on V channel
    blurred : (224,224,3) uint8 RGB after CLAHE + blur
    normalized : (224,224,3) float32 in [0,1]
    """
    # Step 1: Resize
    resized = cv2.resize(rgb, IMG_SIZE, interpolation=cv2.INTER_AREA)
    
    # Step 2: RGB → HSV
    hsv = cv2.cvtColor(resized, cv2.COLOR_RGB2HSV)
    
    # Step 3: CLAHE on V channel only
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    hsv_clahe = hsv.copy()
    hsv_clahe[:, :, 2] = clahe.apply(hsv[:, :, 2])
    
    # Step 4: Convert back to RGB, then apply Gaussian blur
    rgb_clahe = cv2.cvtColor(hsv_clahe, cv2.COLOR_HSV2RGB)
    blurred = cv2.GaussianBlur(rgb_clahe, (5, 5), 0)
    
    # Step 5: Normalize to [0, 1]
    normalized = blurred.astype(np.float32) / 255.0
    
    return resized, hsv, hsv_clahe, blurred, normalized


def hsv_green_mask(rgb_resized: np.ndarray) -> np.ndarray:
    """
    Create binary mask isolating green leaf pixels in HSV space.
    
    Parameters
    ----------
    rgb_resized : np.ndarray
        RGB image (224,224,3)
    
    Returns
    -------
    mask : np.ndarray
        Binary mask (224,224) uint8
    """
    hsv = cv2.cvtColor(rgb_resized, cv2.COLOR_RGB2HSV)
    lo = np.array([25, 30, 30])
    hi = np.array([90, 255, 255])
    return cv2.inRange(hsv, lo, hi)


def extract_color_features(image_rgb: np.ndarray) -> np.ndarray:
    """
    Extract color features from an RGB image.
    
    Returns 78 values:
      - 48: RGB histogram (16 bins × 3 channels, normalized)
      - 6 : RGB per-channel mean + std
      - 18: HSV H-channel histogram (18 bins, normalized)
      - 6 : HSV per-channel mean + std
    """
    feats = []
    
    # RGB histogram: 16 bins per channel
    for ch in range(3):
        hist = cv2.calcHist([image_rgb], [ch], None, [N_BINS_RGB], [0, 256])
        hist = hist.flatten() / (hist.sum() + 1e-7)
        feats.extend(hist)
    
    # RGB per-channel mean + std
    for ch in range(3):
        channel = image_rgb[:, :, ch].astype(np.float32)
        feats.append(channel.mean())
        feats.append(channel.std())
    
    # HSV H-channel histogram: 18 bins
    hsv = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2HSV)
    hist_h = cv2.calcHist([hsv], [0], None, [N_BINS_H], [0, 180])
    hist_h = hist_h.flatten() / (hist_h.sum() + 1e-7)
    feats.extend(hist_h)
    
    # HSV per-channel mean + std
    for ch in range(3):
        channel = hsv[:, :, ch].astype(np.float32)
        feats.append(channel.mean())
        feats.append(channel.std())
    
    return np.array(feats, dtype=np.float32)


def extract_texture_features(image_rgb: np.ndarray) -> np.ndarray:
    """
    Extract texture features.
    
    Returns 34 values:
      - 8 : GLCM (contrast, correlation, energy, homogeneity, mean+std each)
      - 26: LBP histogram (P=24, R=3, uniform → 26 bins)
    """
    feats = []
    gray = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2GRAY)
    
    # GLCM: Quantize to 64 levels to speed up computation
    gray_q = (gray // 4).astype(np.uint8)
    glcm = graycomatrix(
        gray_q,
        distances=[1, 3],
        angles=[0, np.pi / 4, np.pi / 2, 3 * np.pi / 4],
        levels=64,
        symmetric=True,
        normed=True
    )
    
    for prop in ('contrast', 'correlation', 'energy', 'homogeneity'):
        vals = graycoprops(glcm, prop).flatten()
        feats.append(vals.mean())
        feats.append(vals.std())
    
    # LBP
    lbp = local_binary_pattern(gray, P=24, R=3, method='uniform')
    n_bins = 26
    hist, _ = np.histogram(lbp.ravel(), bins=n_bins, range=(0, n_bins))
    hist = hist.astype(np.float32) / (hist.sum() + 1e-7)
    feats.extend(hist)
    
    return np.array(feats, dtype=np.float32)


def extract_shape_features(mask: np.ndarray) -> np.ndarray:
    """
    Extract shape features from a binary mask.
    
    Returns 6 values:
      area, perimeter, circularity, aspect_ratio, solidity, extent
    """
    bin_mask = (mask > 0).astype(np.uint8) * 255
    contours, _ = cv2.findContours(bin_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if not contours:
        return np.zeros(6, dtype=np.float32)
    
    cnt = max(contours, key=cv2.contourArea)
    area = cv2.contourArea(cnt)
    perimeter = cv2.arcLength(cnt, closed=True)
    
    # Circularity: 4π × area / perimeter²
    circularity = (4 * np.pi * area / (perimeter ** 2 + 1e-7))
    
    # Bounding rect → aspect ratio and extent
    x, y, w, h = cv2.boundingRect(cnt)
    aspect_ratio = w / (h + 1e-7)
    extent = area / (w * h + 1e-7)
    
    # Solidity: area / convex hull area
    hull = cv2.convexHull(cnt)
    hull_area = cv2.contourArea(hull)
    solidity = area / (hull_area + 1e-7)
    
    return np.array([area, perimeter, circularity, aspect_ratio, solidity, extent], dtype=np.float32)


def extract_all_features(image_rgb: np.ndarray, mask: np.ndarray) -> np.ndarray:
    """
    Master feature extraction function.
    
    Parameters
    ----------
    image_rgb : np.ndarray
        (224,224,3) uint8 RGB - preprocessed image
    mask : np.ndarray
        (224,224) uint8 - binary segmentation mask
    
    Returns
    -------
    np.ndarray
        Feature vector of shape (118,) dtype float32
        - Color features: 78
        - Texture features: 34
        - Shape features: 6
    """
    color = extract_color_features(image_rgb)      # 78
    texture = extract_texture_features(image_rgb)  # 34
    shape = extract_shape_features(mask)           # 6
    return np.concatenate([color, texture, shape]) # 118

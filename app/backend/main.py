import base64
import io
from collections import OrderedDict
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, Optional, Union, Dict, List, Tuple

import cv2
import joblib
import numpy as np
import torch
import uvicorn
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from torchvision import models as tv_models

from preprocessing import preprocess_image, hsv_green_mask, extract_all_features

ROOT_DIR = Path(__file__).resolve().parents[2]
NOTEBOOKS_DIR = ROOT_DIR / "notebooks"
BACKEND_MODELS_DIR = Path(__file__).resolve().parent / "models"
ML_MODEL_PATH = NOTEBOOKS_DIR / "best_model.pkl"
ML_PCA_MODEL_PATH = NOTEBOOKS_DIR / "best_model_pca.pkl"
DL_PRETRAINED_CANDIDATES = [
    BACKEND_MODELS_DIR / "best_cnn_final.pth",
]
DL_SCRATCH_CANDIDATES = [
    BACKEND_MODELS_DIR / "best_cnn_scratch.pth",
    BACKEND_MODELS_DIR / "best_cnn_scrtach.pth",
]
DATASET_DIR = NOTEBOOKS_DIR / "data" / "PlantVillage"
PREPROCESSED_DIR = NOTEBOOKS_DIR / "preprocessed"
IMG_SIZE = (224, 224)

ml_bundle: Optional[Dict[str, Any]] = None
ml_model: Any = None
ml_scaler: Any = None
ml_label_encoder: Any = None
ml_pca_bundle: Optional[Dict[str, Any]] = None
ml_pca_model: Any = None
ml_pca_scaler: Any = None
ml_pca_transformer: Any = None
ml_pca_label_encoder: Any = None
dl_model: Any = None
dl_model_kind: str = "unknown"
dl_model_path: Optional[str] = None
dl_scratch_model: Any = None
dl_scratch_model_kind: str = "unknown"
dl_scratch_model_path: Optional[str] = None
dl_labels: List[str] = []


def _build_pretrained_resnet18(num_classes: int) -> torch.nn.Module:
    try:
        model = tv_models.resnet18(weights=tv_models.ResNet18_Weights.DEFAULT)
    except Exception:
        model = tv_models.resnet18(weights=None)

    in_features = model.fc.in_features
    model.fc = torch.nn.Linear(in_features, num_classes)
    return model


def _build_scratch_cnn(num_classes: int) -> torch.nn.Module:
    return torch.nn.Sequential(
        OrderedDict(
            [
                (
                    "features",
                    torch.nn.Sequential(
                        torch.nn.Conv2d(3, 32, kernel_size=3, padding=1),
                        torch.nn.ReLU(inplace=True),
                        torch.nn.BatchNorm2d(32),
                        torch.nn.MaxPool2d(kernel_size=2, stride=2),
                        torch.nn.Conv2d(32, 64, kernel_size=3, padding=1),
                        torch.nn.ReLU(inplace=True),
                        torch.nn.BatchNorm2d(64),
                        torch.nn.MaxPool2d(kernel_size=2, stride=2),
                        torch.nn.Conv2d(64, 128, kernel_size=3, padding=1),
                        torch.nn.ReLU(inplace=True),
                        torch.nn.BatchNorm2d(128),
                        torch.nn.MaxPool2d(kernel_size=2, stride=2),
                        torch.nn.Conv2d(128, 256, kernel_size=3, padding=1),
                        torch.nn.ReLU(inplace=True),
                        torch.nn.BatchNorm2d(256),
                        torch.nn.AdaptiveAvgPool2d((1, 1)),
                    ),
                ),
                (
                    "classifier",
                    torch.nn.Sequential(
                        torch.nn.Flatten(),
                        torch.nn.Dropout(p=0.4),
                        torch.nn.Linear(256, 128),
                        torch.nn.ReLU(inplace=True),
                        torch.nn.Dropout(p=0.2),
                        torch.nn.Linear(128, num_classes),
                    ),
                ),
            ]
        )
    )


def _first_existing_path(paths: List[Path]) -> Optional[Path]:
    for path in paths:
        if path.exists():
            return path
    return None



def _normalize_state_dict_keys(state_dict: Dict[str, Any]) -> Dict[str, Any]:
    if not state_dict:
        return state_dict
    if all(key.startswith("module.") for key in state_dict.keys()):
        return {key.replace("module.", "", 1): value for key, value in state_dict.items()}
    return state_dict


def _infer_num_classes_from_state_dict(state_dict: Dict[str, Any], fallback: int) -> int:
    for key in ("fc.weight", "classifier.5.weight"):
        weight = state_dict.get(key)
        if isinstance(weight, torch.Tensor) and weight.ndim == 2:
            return int(weight.shape[0])
    return fallback


def _build_dl_model_from_state_dict(state_dict: Dict[str, Any], num_classes: int) -> Union[Tuple[torch.nn.Module, str], Tuple[None, str]]:
    builders = [
        (
            "resnet18",
            lambda n: _build_pretrained_resnet18(n),
        ),
        (
            "simplecnn",
            lambda n: _build_scratch_cnn(n),
        ),
    ]
    for kind, builder in builders:
        model = builder(num_classes)
        try:
            model.load_state_dict(state_dict, strict=True)
            return model.eval(), kind
        except RuntimeError:
            continue
    return None, "unsupported"


def _load_dl_checkpoint(
    checkpoint_path: Path,
    builders: List[Tuple[str, Any]],
    fallback_classes: int,
) -> Tuple[Optional[torch.nn.Module], str]:
    raw_model = torch.load(checkpoint_path, map_location=torch.device("cpu"))
    if isinstance(raw_model, torch.nn.Module):
        return raw_model.eval(), raw_model.__class__.__name__.lower()

    if not isinstance(raw_model, dict):
        return None, "unsupported"

    state_dict = raw_model.get("state_dict", raw_model)
    if not isinstance(state_dict, dict):
        return None, "unsupported"

    state_dict = _normalize_state_dict_keys(state_dict)
    class_count = _infer_num_classes_from_state_dict(state_dict, fallback_classes)

    for kind, builder in builders:
        model = builder(class_count)
        try:
            model.load_state_dict(state_dict, strict=True)
            return model.eval(), kind
        except RuntimeError:
            continue
    return None, "unsupported"


def _load_labels() -> List[str]:
    def has_direct_images(folder: Path) -> bool:
        patterns = ("*.jpg", "*.jpeg", "*.png", "*.JPG", "*.JPEG", "*.PNG")
        return any(folder.glob(pattern) for pattern in patterns)

    for labels_root in (PREPROCESSED_DIR, DATASET_DIR):
        if not labels_root.exists():
            continue

        labels = [
            p.name
            for p in labels_root.iterdir()
            if p.is_dir()
            and not p.name.startswith(".")
            and p.name != "PlantVillage"
            and has_direct_images(p)
        ]
        if labels:
            return sorted(labels)

    return []


def load_models() -> None:
    global ml_bundle, ml_model, ml_scaler, ml_label_encoder
    global ml_pca_bundle, ml_pca_model, ml_pca_scaler, ml_pca_transformer, ml_pca_label_encoder
    global dl_model, dl_model_kind, dl_model_path
    global dl_scratch_model, dl_scratch_model_kind, dl_scratch_model_path
    global dl_labels

    ml_bundle = None
    ml_model = None
    ml_scaler = None
    ml_label_encoder = None
    ml_pca_bundle = None
    ml_pca_model = None
    ml_pca_scaler = None
    ml_pca_transformer = None
    ml_pca_label_encoder = None
    dl_model = None
    dl_model_kind = "unknown"
    dl_model_path = None
    dl_scratch_model = None
    dl_scratch_model_kind = "unknown"
    dl_scratch_model_path = None
    dl_labels = _load_labels()

    # Load standard ML model
    if ML_MODEL_PATH.exists():
        loaded_ml = joblib.load(ML_MODEL_PATH)
        if isinstance(loaded_ml, dict):
            ml_bundle = loaded_ml
            ml_model = loaded_ml.get("model")
            ml_scaler = loaded_ml.get("scaler")
            ml_label_encoder = loaded_ml.get("label_encoder")
        else:
            ml_model = loaded_ml

    # Load PCA ML model
    if ML_PCA_MODEL_PATH.exists():
        loaded_pca = joblib.load(ML_PCA_MODEL_PATH)
        if isinstance(loaded_pca, dict):
            ml_pca_bundle = loaded_pca
            ml_pca_model = loaded_pca.get("model")
            ml_pca_scaler = loaded_pca.get("scaler")
            ml_pca_transformer = loaded_pca.get("pca")
            ml_pca_label_encoder = loaded_pca.get("label_encoder")

    pretrained_path = _first_existing_path(DL_PRETRAINED_CANDIDATES)
    if pretrained_path is not None:
        candidate, kind = _load_dl_checkpoint(
            pretrained_path,
            [("resnet18", lambda n: _build_pretrained_resnet18(n))],
            len(dl_labels) if dl_labels else 1,
        )
        if isinstance(candidate, torch.nn.Module):
            dl_model = candidate
            dl_model_kind = kind
            dl_model_path = str(pretrained_path)

    scratch_path = _first_existing_path(DL_SCRATCH_CANDIDATES)
    if scratch_path is not None:
        scratch_candidate, scratch_kind = _load_dl_checkpoint(
            scratch_path,
            [("simplecnn", lambda n: _build_scratch_cnn(n))],
            len(dl_labels) if dl_labels else 1,
        )
        if isinstance(scratch_candidate, torch.nn.Module):
            dl_scratch_model = scratch_candidate
            dl_scratch_model_kind = scratch_kind
            dl_scratch_model_path = str(scratch_path)

    print(
        "Model status => "
        f"ML: {'loaded' if ml_model is not None else 'missing'}, "
        f"ML-PCA: {'loaded' if ml_pca_model is not None else 'missing'}, "
        f"DL pretrained: {dl_model_kind if isinstance(dl_model, torch.nn.Module) else 'missing or unsupported checkpoint'}, "
        f"DL scratch: {dl_scratch_model_kind if isinstance(dl_scratch_model, torch.nn.Module) else 'missing or unsupported checkpoint'}, "
        f"labels: {len(dl_labels)}"
    )


def image_to_base64(img: np.ndarray) -> str:
    success, buffer = cv2.imencode(".png", img)
    if not success:
        raise ValueError("Failed to encode generated image.")
    return base64.b64encode(buffer).decode("utf-8")


def _render_histogram_image(image_np: np.ndarray) -> np.ndarray:
    height, width = 280, 420
    canvas = np.full((height, width, 3), 245, dtype=np.uint8)
    margin = 20
    usable_h = height - 2 * margin
    usable_w = width - 2 * margin

    # Axis
    cv2.line(canvas, (margin, height - margin), (width - margin, height - margin), (190, 190, 190), 1)
    cv2.line(canvas, (margin, margin), (margin, height - margin), (190, 190, 190), 1)

    channel_colors = [(72, 116, 186), (93, 112, 82), (193, 140, 93)]
    for ch_idx, color in enumerate(channel_colors):
        hist = cv2.calcHist([image_np], [ch_idx], None, [256], [0, 256]).flatten()
        if np.max(hist) > 0:
            hist = hist / np.max(hist)
        points = []
        for i, value in enumerate(hist):
            x = int(margin + (i / 255.0) * usable_w)
            y = int(height - margin - value * usable_h)
            points.append([x, y])
        pts = np.array(points, dtype=np.int32).reshape((-1, 1, 2))
        cv2.polylines(canvas, [pts], False, color, 2)

    cv2.putText(canvas, "RGB Histogram", (margin, 16), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (90, 90, 90), 1, cv2.LINE_AA)
    return canvas


def _extract_feature_vector(image_np: np.ndarray) -> np.ndarray:
    """
    Extract 118-dimensional feature vector using the SAME pipeline as training.
    Training uses: resize → extract features (NO preprocessing/blurring!)
    """
    # Resize to 224x224 (same as training)
    if image_np.shape[:2] != IMG_SIZE:
        rgb = cv2.resize(image_np, IMG_SIZE, interpolation=cv2.INTER_AREA)
    else:
        rgb = image_np
    
    # Create HSV green mask from resized RGB
    mask = hsv_green_mask(rgb)
    
    # Extract all features from RAW resized image (not preprocessed!)
    feature_vector = extract_all_features(rgb, mask)
    
    return feature_vector


def _get_image_analysis(image_np: np.ndarray) -> Dict[str, str]:
    """
    Generate analysis visualizations from the raw input image.
    Note: Uses raw image for visualization purposes, not preprocessed version.
    """
    gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
    
    # Sobel edge detection
    sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=5)
    sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=5)
    sobel = cv2.magnitude(sobelx, sobely)
    sobel = cv2.normalize(sobel, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    
    # Canny edge detection
    canny = cv2.Canny(gray, 80, 180)
    
    # RGB Histogram
    hist_img = _render_histogram_image(image_np)
    
    # HSV visualization
    hsv = cv2.cvtColor(image_np, cv2.COLOR_RGB2HSV)
    hsv_vis = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
    
    # Green mask (for leaf segmentation)
    lower_green = np.array([25, 30, 30], dtype=np.uint8)
    upper_green = np.array([90, 255, 255], dtype=np.uint8)
    green_mask = cv2.inRange(hsv, lower_green, upper_green)
    
    # Apply mask to original image
    masked_leaf = cv2.bitwise_and(image_np, image_np, mask=green_mask)

    return {
        "sobel": image_to_base64(sobel),
        "histogram": image_to_base64(hist_img),
        "grayscale": image_to_base64(gray),
        "canny": image_to_base64(canny),
        "hsv": image_to_base64(hsv_vis),
        "green_mask": image_to_base64(green_mask),
        "masked_leaf": image_to_base64(masked_leaf),
    }


def _predict_ml(feature_vector: np.ndarray) -> Tuple[str, float]:
    if ml_model is None:
        return "Unavailable", 0.0

    inference_vector = feature_vector
    if ml_scaler is not None:
        inference_vector = ml_scaler.transform(inference_vector)

    pred = ml_model.predict(inference_vector)[0]

    score = 0.0
    if hasattr(ml_model, "predict_proba"):
        score = float(np.max(ml_model.predict_proba(inference_vector)))

    pred_label = pred
    if ml_label_encoder is not None:
        try:
            pred_label = ml_label_encoder.inverse_transform(np.array([pred]))[0]
        except Exception:
            pred_label = pred

    return str(pred_label), score


def _predict_ml_pca(feature_vector: np.ndarray) -> Tuple[str, float, int]:
    """Predict using PCA-reduced ML model"""
    if ml_pca_model is None:
        return "Unavailable", 0.0, 0

    inference_vector = feature_vector
    
    # Apply scaler
    if ml_pca_scaler is not None:
        inference_vector = ml_pca_scaler.transform(inference_vector)
    
    # Apply PCA transformation
    if ml_pca_transformer is not None:
        inference_vector = ml_pca_transformer.transform(inference_vector)
        n_components = inference_vector.shape[1]
    else:
        n_components = inference_vector.shape[1]

    pred = ml_pca_model.predict(inference_vector)[0]

    score = 0.0
    if hasattr(ml_pca_model, "predict_proba"):
        score = float(np.max(ml_pca_model.predict_proba(inference_vector)))

    pred_label = pred
    if ml_pca_label_encoder is not None:
        try:
            pred_label = ml_pca_label_encoder.inverse_transform(np.array([pred]))[0]
        except Exception:
            pred_label = pred

    return str(pred_label), score, n_components


def _preprocess_dl_tensor(image_np: np.ndarray, model_kind: str) -> torch.Tensor:
    """
    Preprocess image for deep learning models.
    Uses unified preprocessing pipeline for consistency.
    """
    # Apply the same preprocessing as ML model (5 steps)
    _, _, _, blurred, _ = preprocess_image(image_np)
    
    # Convert to tensor and normalize to [0, 1]
    tensor = torch.from_numpy(blurred.astype(np.float32) / 255.0).permute(2, 0, 1).unsqueeze(0)

    # Apply ImageNet normalization for ResNet models
    if "resnet" in model_kind:
        mean = torch.tensor([0.485, 0.456, 0.406], dtype=tensor.dtype).view(1, 3, 1, 1)
        std = torch.tensor([0.229, 0.224, 0.225], dtype=tensor.dtype).view(1, 3, 1, 1)
        tensor = (tensor - mean) / std

    return tensor


def _predict_dl(image_np: np.ndarray, model: Any, model_kind: str, model_label: str) -> Tuple[str, float, str]:
    if not isinstance(model, torch.nn.Module):
        return (
            "Unavailable",
            0.0,
            f"Deep Learning {model_label} checkpoint could not be mapped to a supported architecture.",
        )

    img_tensor = _preprocess_dl_tensor(image_np, model_kind)
    with torch.no_grad():
        output = model(img_tensor)
        probabilities = torch.nn.functional.softmax(output, dim=1)
        conf, pred_idx = torch.max(probabilities, dim=1)

    idx = int(pred_idx.item())
    label = dl_labels[idx] if 0 <= idx < len(dl_labels) else f"class_{idx}"
    score = float(conf.item())
    explanation = f"The Deep Learning {model_label} model ({model_kind}) recognized {label} from lesion texture and spatial disease patterns."
    return label, score, explanation

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_models()
    yield

app = FastAPI(title="Plant Disease Detection API", lifespan=lifespan)

# CORS configuration for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if ml_model is None and ml_pca_model is None:
        raise HTTPException(status_code=500, detail="No ML models loaded")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid image file.") from exc

    image_np = np.array(image)
    
    # Generate analysis visualizations from raw image
    analysis = _get_image_analysis(image_np)

    # Extract features using unified preprocessing pipeline
    feature_vector = _extract_feature_vector(image_np).reshape(1, -1)
    
    # Verify feature dimensions
    if feature_vector.shape[1] != 118:
        raise HTTPException(
            status_code=500, 
            detail=f"Feature extraction error: expected 118 features, got {feature_vector.shape[1]}"
        )
    
    # ML prediction with error handling
    try:
        ml_class, ml_score = _predict_ml(feature_vector)
    except Exception as e:
        print(f"ML prediction error: {e}")
        ml_class = "Unknown"
        ml_score = 0.0

    # ML-PCA prediction
    try:
        ml_pca_class, ml_pca_score, n_pca_components = _predict_ml_pca(feature_vector)
    except Exception as e:
        print(f"ML-PCA prediction error: {e}")
        ml_pca_class = "Unknown"
        ml_pca_score = 0.0
        n_pca_components = 0

    # DL predictions
    dl_class, dl_score, dl_explanation = _predict_dl(image_np, dl_model, dl_model_kind, "pretrained")
    dl_scratch_class, dl_scratch_score, dl_scratch_explanation = _predict_dl(
        image_np,
        dl_scratch_model,
        dl_scratch_model_kind,
        "scratch",
    )

    return {
        "dl": {
            "class": dl_class,
            "score": round(dl_score * 100, 2),
            "explanation": dl_explanation,
        },
        "dl_scratch": {
            "class": dl_scratch_class,
            "score": round(dl_scratch_score * 100, 2),
            "explanation": dl_scratch_explanation,
        },
        "ml": {
            "class": ml_class,
            "score": round(ml_score * 100, 2),
            "explanation": f"The Machine Learning model identified {ml_class} from handcrafted color, texture, and shape descriptors (118 features)."
        },
        "ml_pca": {
            "class": ml_pca_class,
            "score": round(ml_pca_score * 100, 2),
            "explanation": f"The ML-PCA model identified {ml_pca_class} using dimensionality reduction (118 → {n_pca_components} features, 95% variance retained). Faster inference with minimal accuracy loss.",
            "n_components": n_pca_components,
            "variance_retained": 0.95
        },
        "analysis": analysis,
        "meta": {
            "feature_count": int(feature_vector.shape[1]),
            "pca_components": n_pca_components,
            "models": {
                "ml_loaded": ml_model is not None,
                "ml_pca_loaded": ml_pca_model is not None,
                "dl_loaded": isinstance(dl_model, torch.nn.Module),
                "dl_scratch_loaded": isinstance(dl_scratch_model, torch.nn.Module),
                "dl_model_kind": dl_model_kind,
                "dl_scratch_model_kind": dl_scratch_model_kind,
                "dl_model_path": dl_model_path,
                "dl_scratch_model_path": dl_scratch_model_path,
            },
        },
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

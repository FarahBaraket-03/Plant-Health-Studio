"""
Validation script to ensure preprocessing consistency between training and inference.
"""

import sys
from pathlib import Path

import cv2
import joblib
import numpy as np

sys.path.insert(0, str(Path(__file__).parent))

from preprocessing import preprocess_image, hsv_green_mask, extract_all_features


def validate_on_folder(folder_path: str, expected_label: str, model_path: str = "../../notebooks/best_model.pkl"):
    """
    Validate preprocessing and prediction on a folder of images.
    
    Parameters
    ----------
    folder_path : str
        Path to folder containing test images
    expected_label : str
        Expected disease class (for validation)
    model_path : str
        Path to model bundle
    """
    folder = Path(folder_path)
    if not folder.exists():
        raise FileNotFoundError(f"Folder not found: {folder_path}")
    
    # Load model
    model_bundle_path = Path(__file__).parent / model_path
    bundle = joblib.load(model_bundle_path)
    
    model = bundle.get("model") if isinstance(bundle, dict) else bundle
    scaler = bundle.get("scaler") if isinstance(bundle, dict) else None
    label_encoder = bundle.get("label_encoder") if isinstance(bundle, dict) else None
    
    if model is None:
        raise ValueError("Model could not be loaded")
    
    # Find images
    image_paths = []
    for ext in ["*.jpg", "*.jpeg", "*.png", "*.JPG", "*.JPEG", "*.PNG"]:
        image_paths.extend(folder.glob(ext))
    
    if not image_paths:
        raise FileNotFoundError(f"No images found in {folder_path}")
    
    print(f"\nValidation folder: {folder}")
    print(f"Expected label: {expected_label}")
    print(f"Total images: {len(image_paths)}")
    print(f"Scaler available: {scaler is not None}")
    print(f"Label encoder available: {label_encoder is not None}")
    print("="*60)
    
    results = []
    
    for img_path in image_paths:
        try:
            # Load image
            bgr = cv2.imread(str(img_path))
            if bgr is None:
                continue
            
            rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
            
            # Apply preprocessing
            _, _, _, blurred, _ = preprocess_image(rgb)
            
            # Extract features
            mask = hsv_green_mask(blurred)
            features = extract_all_features(blurred, mask).reshape(1, -1)
            
            # Scale features (CRITICAL)
            if scaler is not None:
                features = scaler.transform(features)
            
            # Predict
            pred = model.predict(features)[0]
            
            # Decode label
            if label_encoder is not None:
                try:
                    pred_label = label_encoder.inverse_transform([pred])[0]
                except Exception:
                    pred_label = str(pred)
            else:
                pred_label = str(pred)
            
            results.append((img_path.name, pred_label))
            
        except Exception as e:
            print(f"  ERROR processing {img_path.name}: {e}")
    
    if not results:
        print("No images were successfully processed")
        return
    
    # Analyze results
    pred_labels = [p for _, p in results]
    unique_labels, counts = np.unique(pred_labels, return_counts=True)
    
    print("\nPrediction Distribution:")
    print("-"*60)
    for label, count in sorted(zip(unique_labels, counts), key=lambda x: x[1], reverse=True):
        percentage = (count / len(results)) * 100
        match = "✓" if label.lower().replace("_", "").replace(" ", "") == expected_label.lower().replace("_", "").replace(" ", "") else "✗"
        print(f"  {match} {label}: {count}/{len(results)} ({percentage:.1f}%)")
    
    # Calculate accuracy
    expected_norm = expected_label.lower().replace("_", "").replace(" ", "")
    correct = sum(1 for _, p in results if p.lower().replace("_", "").replace(" ", "") == expected_norm)
    accuracy = (correct / len(results)) * 100
    
    print("-"*60)
    print(f"Accuracy: {correct}/{len(results)} ({accuracy:.1f}%)")
    print("="*60)
    
    # Show first 10 predictions
    print("\nFirst 10 predictions:")
    for i, (fname, pred) in enumerate(results[:10], 1):
        match = "✓" if pred.lower().replace("_", "").replace(" ", "") == expected_norm else "✗"
        print(f"  {i:2d}. {match} {fname} → {pred}")


def main():
    """Command-line interface."""
    if len(sys.argv) < 3:
        print("Usage: python validate_preprocessing.py <folder_path> <expected_label> [model_path]")
        print("\nExample:")
        print("  python validate_preprocessing.py ../../notebooks/data/Valid_data/potato_Healthy Potato___healthy")
        sys.exit(1)
    
    folder_path = sys.argv[1]
    expected_label = sys.argv[2]
    model_path = sys.argv[3] if len(sys.argv) > 3 else "../../notebooks/best_model.pkl"
    
    try:
        validate_on_folder(folder_path, expected_label, model_path)
    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()

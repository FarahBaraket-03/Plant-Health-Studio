"""
Standalone prediction script for single images.
Ensures consistent preprocessing and scaler usage.
"""

import sys
from pathlib import Path

import cv2
import joblib
import numpy as np

# Add backend to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from preprocessing import preprocess_image, hsv_green_mask, extract_all_features


def load_ml_model(model_path: str = "../../notebooks/best_model.pkl"):
    """Load the ML model bundle with scaler and label encoder."""
    model_path = Path(__file__).parent / model_path
    
    if not model_path.exists():
        raise FileNotFoundError(f"Model not found at {model_path}")
    
    bundle = joblib.load(model_path)
    
    if isinstance(bundle, dict):
        return bundle.get("model"), bundle.get("scaler"), bundle.get("label_encoder")
    else:
        # Old format: just the model
        return bundle, None, None


def predict_image(image_path: str, model_path: str = "../../notebooks/best_model.pkl"):
    """
    Predict disease class for a single image.
    
    Parameters
    ----------
    image_path : str
        Path to the input image
    model_path : str
        Path to the model bundle (default: notebooks/best_model.pkl)
    
    Returns
    -------
    dict
        Prediction results with class, confidence, and feature info
    """
    # Load model
    model, scaler, label_encoder = load_ml_model(model_path)
    
    if model is None:
        raise ValueError("Model could not be loaded")
    
    # Load image
    img_path = Path(image_path)
    if not img_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")
    
    bgr = cv2.imread(str(img_path))
    if bgr is None:
        raise ValueError(f"Could not read image: {image_path}")
    
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    
    # Apply preprocessing pipeline (same as training)
    print(f"Processing: {img_path.name}")
    print(f"  Original shape: {rgb.shape}")
    
    _, _, _, blurred, _ = preprocess_image(rgb)
    print(f"  Preprocessed shape: {blurred.shape}")
    
    # Extract features
    mask = hsv_green_mask(blurred)
    features = extract_all_features(blurred, mask)
    print(f"  Feature vector shape: {features.shape}")
    
    # Reshape for prediction
    features = features.reshape(1, -1)
    
    # Apply scaler (CRITICAL: must use the same scaler as training)
    if scaler is not None:
        features_scaled = scaler.transform(features)
        print(f"  Features scaled using saved scaler")
    else:
        features_scaled = features
        print(f"  WARNING: No scaler found, using raw features")
    
    # Predict
    prediction = model.predict(features_scaled)[0]
    
    # Get confidence if available
    confidence = 0.0
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(features_scaled)
        confidence = float(np.max(proba))
    
    # Decode label
    if label_encoder is not None:
        try:
            predicted_label = label_encoder.inverse_transform([prediction])[0]
        except Exception:
            predicted_label = str(prediction)
    else:
        predicted_label = str(prediction)
    
    return {
        "image": img_path.name,
        "predicted_class": predicted_label,
        "confidence": confidence,
        "raw_prediction": int(prediction) if isinstance(prediction, (int, np.integer)) else prediction,
        "feature_count": features.shape[1],
        "scaler_used": scaler is not None,
        "label_encoder_used": label_encoder is not None
    }


def main():
    """Command-line interface for single image prediction."""
    if len(sys.argv) < 2:
        print("Usage: python predict_single.py <image_path> [model_path]")
        print("\nExample:")
        print("  python predict_single.py ../../notebooks/data/Valid_data/potato_Healthy/image.jpg")
        sys.exit(1)
    
    image_path = sys.argv[1]
    model_path = sys.argv[2] if len(sys.argv) > 2 else "../../notebooks/best_model.pkl"
    
    try:
        result = predict_image(image_path, model_path)
        
        print("\n" + "="*60)
        print("PREDICTION RESULT")
        print("="*60)
        print(f"Image:            {result['image']}")
        print(f"Predicted Class:  {result['predicted_class']}")
        print(f"Confidence:       {result['confidence']:.2%}")
        print(f"Feature Count:    {result['feature_count']}")
        print(f"Scaler Used:      {result['scaler_used']}")
        print(f"Label Encoder:    {result['label_encoder_used']}")
        print("="*60)
        
    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()

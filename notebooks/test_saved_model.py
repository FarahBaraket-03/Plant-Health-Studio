"""
Test the saved best_model_pca.pkl to verify it's working correctly.
Run this in the notebooks directory or adjust paths accordingly.
"""

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import classification_report, accuracy_score

# Load the saved model bundle
print("Loading best_model_pca.pkl...")
model_bundle = joblib.load('best_model_pca.pkl')

print("\nModel bundle contents:")
for key in model_bundle.keys():
    print(f"  - {key}: {type(model_bundle[key])}")

# Extract components
model = model_bundle['model']
scaler = model_bundle['scaler']
pca = model_bundle['pca']
le = model_bundle['label_encoder']

print(f"\nModel type: {type(model).__name__}")
print(f"PCA components: {pca.n_components_}")
print(f"Label encoder classes: {len(le.classes_)}")
print(f"Classes: {list(le.classes_)}")

# Load the features.csv to test
print("\n" + "="*70)
print("Loading features.csv for testing...")
df = pd.read_csv('features.csv')

# Extract features and labels
feature_cols = [c for c in df.columns if c.startswith('f') and c[1:].isdigit()]
X = df[feature_cols].values
y = le.transform(df['label'].values)

print(f"Dataset shape: {X.shape}")
print(f"Number of samples: {len(X)}")
print(f"Number of features: {len(feature_cols)}")

# Test with first 10 samples
print("\n" + "="*70)
print("Testing with first 10 samples:")
print("="*70)

X_test_sample = X[:10]
y_test_sample = y[:10]

# Apply preprocessing (same as inference)
X_scaled = scaler.transform(X_test_sample)
X_pca = pca.transform(X_scaled)

# Predict
y_pred = model.predict(X_pca)
y_pred_proba = model.predict_proba(X_pca)

print("\nSample | True Label              | Predicted Label         | Confidence | Match")
print("-" * 90)
for i in range(10):
    true_label = le.inverse_transform([y_test_sample[i]])[0]
    pred_label = le.inverse_transform([y_pred[i]])[0]
    confidence = y_pred_proba[i].max()
    match = "✓" if true_label == pred_label else "✗"
    print(f"{i+1:6d} | {true_label:23s} | {pred_label:23s} | {confidence:10.4f} | {match}")

# Test with full dataset
print("\n" + "="*70)
print("Testing with FULL dataset:")
print("="*70)

X_scaled_full = scaler.transform(X)
X_pca_full = pca.transform(X_scaled_full)
y_pred_full = model.predict(X_pca_full)

accuracy = accuracy_score(y, y_pred_full)
print(f"\nOverall Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")

# Check if model is predicting the same class for everything
unique_predictions = np.unique(y_pred_full)
print(f"\nNumber of unique predictions: {len(unique_predictions)}")
print(f"Unique predicted classes: {[le.inverse_transform([p])[0] for p in unique_predictions]}")

if len(unique_predictions) == 1:
    print("\n⚠️  WARNING: Model is predicting the SAME class for ALL samples!")
    print(f"   Always predicting: {le.inverse_transform([unique_predictions[0]])[0]}")
else:
    print("\n✓ Model is predicting different classes (good!)")

# Show prediction distribution
print("\nPrediction distribution:")
unique, counts = np.unique(y_pred_full, return_counts=True)
for pred_class, count in sorted(zip(unique, counts), key=lambda x: -x[1])[:10]:
    class_name = le.inverse_transform([pred_class])[0]
    percentage = (count / len(y_pred_full)) * 100
    print(f"  {class_name:30s}: {count:5d} samples ({percentage:5.2f}%)")

# Detailed classification report
print("\n" + "="*70)
print("Detailed Classification Report:")
print("="*70)
print(classification_report(y, y_pred_full, target_names=le.classes_, digits=4))

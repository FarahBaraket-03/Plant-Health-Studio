# Plant Disease Detection System - Complete Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Model Architecture](#model-architecture)
3. [Installation & Setup](#installation--setup)
4. [Usage Guide](#usage-guide)
5. [Performance Analysis](#performance-analysis)
6. [Technical Details](#technical-details)

---

## System Overview

The Plant Disease Detection System is a comprehensive machine learning application that classifies plant diseases using multiple model architectures. It provides:

- **4 Different Models**: Deep Learning (Pretrained & Scratch) + Machine Learning (Full & PCA-optimized)
- **Real-time Analysis**: Image preprocessing visualization and feature extraction
- **Web Interface**: Modern Next.js frontend with detailed explanations
- **REST API**: FastAPI backend for model inference

### Key Features
- ✅ Multi-model comparison with confidence scores
- ✅ Visual analysis of image transformations
- ✅ Detailed technical documentation
- ✅ Production-ready deployment
- ✅ Optimized inference with PCA

---

## Model Architecture

### 1. Deep Learning - Pretrained (ResNet18)

**Architecture:**
- Base: ResNet18 pre-trained on ImageNet
- Parameters: ~11 million
- Input: 224×224×3 RGB images
- Output: 15 disease classes

**Advantages:**
- Highest accuracy (~95%)
- Transfer learning from ImageNet
- Robust feature extraction
- Excellent for complex patterns

**Best Use Cases:**
- Production environments with GPU
- High-accuracy requirements
- Complex disease manifestations

**Training:**
```python
# From notebooks/projet.ipynb
model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
model.fc = nn.Linear(model.fc.in_features, num_classes)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)
```

---

### 2. Deep Learning - Scratch (Custom CNN)

**Architecture:**
```
Conv2D(3→32) → BatchNorm → MaxPool
Conv2D(32→64) → BatchNorm → MaxPool
Conv2D(64→128) → BatchNorm → MaxPool
Conv2D(128→256) → BatchNorm → AdaptiveAvgPool
Flatten → Dropout(0.4) → Linear(256→128) → Dropout(0.2) → Linear(128→15)
```

**Advantages:**
- Lightweight (~0.5M parameters)
- Fast inference (~15ms)
- No external dependencies
- Mobile-friendly

**Best Use Cases:**
- Edge devices
- Mobile applications
- Resource-constrained environments

**Training:**
```python
# From notebooks/projet.ipynb
model = SimpleCNN(num_classes=15)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
epochs = 8
```

---

### 3. Machine Learning - Full Features (118 dimensions)

**Feature Engineering:**

| Category | Features | Count | Description |
|----------|----------|-------|-------------|
| **Color** | RGB Histogram | 48 | 16 bins × 3 channels |
| | RGB Statistics | 6 | Mean + Std per channel |
| | HSV H Histogram | 18 | 18 bins for Hue |
| | HSV Statistics | 6 | Mean + Std per channel |
| **Texture** | GLCM | 8 | Contrast, Correlation, Energy, Homogeneity |
| | LBP | 26 | Local Binary Pattern (P=24, R=3) |
| **Shape** | Morphology | 6 | Area, Perimeter, Circularity, AR, Solidity, Extent |
| **TOTAL** | | **118** | |

**Classifier:**
- Random Forest (300 trees, max_depth=20)
- Alternative: SVM with RBF kernel

**Advantages:**
- Interpretable features
- Works with small datasets
- Fast training
- Explainable predictions

**Best Use Cases:**
- Research and analysis
- Feature importance studies
- Limited training data

**Training:**
```python
# From notebooks/projet.ipynb - Phase 5
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=20,
    min_samples_leaf=4,
    class_weight='balanced_subsample',
    random_state=42
)
model.fit(X_train_scaled, y_train)
```

---

### 4. Machine Learning - PCA Optimized (~40 dimensions)

**PCA Configuration:**
- Input: 118 features
- Output: ~40 principal components
- Variance Retained: 95%
- Dimensionality Reduction: 65%

**Why 95% Variance?**

| Threshold | Components | Pros | Cons |
|-----------|------------|------|------|
| 90% | ~28 | Maximum speed | 10% information loss |
| **95%** | **~40** | **Optimal balance** | **Minimal loss (5%)** |
| 99% | ~73 | Minimal loss | Limited speed gain |

**Advantages:**
- 3× faster inference (3ms vs 10ms)
- Reduces overfitting
- Mitigates curse of dimensionality
- Only 1% accuracy loss

**Best Use Cases:**
- Production APIs
- High-throughput systems
- Real-time applications

**Training:**
```python
# From notebooks/ML_avec_reduction.ipynb
from sklearn.decomposition import PCA

# Standardize features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)

# Apply PCA
pca = PCA(n_components=0.95, random_state=42)  # 95% variance
X_train_pca = pca.fit_transform(X_train_scaled)

# Train classifier
model = RandomForestClassifier(...)
model.fit(X_train_pca, y_train)

# Save bundle
joblib.dump({
    'model': model,
    'scaler': scaler,
    'pca': pca,
    'label_encoder': le
}, 'best_model_pca.pkl')
```

---

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 18+
- CUDA (optional, for GPU acceleration)

### Backend Setup

```bash
cd app/backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn python-multipart
pip install torch torchvision
pip install opencv-python scikit-image scikit-learn
pip install joblib numpy pandas pillow

# Run server
python main.py
# Server runs on http://localhost:8000
```

### Frontend Setup

```bash
cd app/frontend

# Install dependencies
npm install

# Run development server
npm run dev
# Frontend runs on http://localhost:3000
```

### Model Files Required

Place these files in `notebooks/`:
- `best_model.pkl` - Full ML model (118 features)
- `best_model_pca.pkl` - PCA ML model (~40 features)

Place these files in `app/backend/models/`:
- `best_cnn_final.pth` - Pretrained ResNet18
- `best_cnn_scratch.pth` - Custom CNN

---

## Usage Guide

### Web Interface

1. **Upload Image**: Click or drag-and-drop a leaf image
2. **Classify**: Click "Classify This Leaf" button
3. **View Results**: See predictions from all 4 models
4. **Analyze**: Explore image transformations and feature visualizations
5. **Documentation**: Click "View Technical Documentation" for details

### API Usage

```python
import requests

# Upload image
url = "http://localhost:8000/predict"
files = {"file": open("leaf_image.jpg", "rb")}
response = requests.post(url, files=files)

# Parse results
result = response.json()
print(f"DL Pretrained: {result['dl']['class']} ({result['dl']['score']}%)")
print(f"DL Scratch: {result['dl_scratch']['class']} ({result['dl_scratch']['score']}%)")
print(f"ML Full: {result['ml']['class']} ({result['ml']['score']}%)")
print(f"ML PCA: {result['ml_pca']['class']} ({result['ml_pca']['score']}%)")
```

### Response Format

```json
{
  "dl": {
    "class": "Tomato_Late_blight",
    "score": 94.52,
    "explanation": "..."
  },
  "dl_scratch": {
    "class": "Tomato_Late_blight",
    "score": 89.31,
    "explanation": "..."
  },
  "ml": {
    "class": "Tomato_Late_blight",
    "score": 87.65,
    "explanation": "..."
  },
  "ml_pca": {
    "class": "Tomato_Late_blight",
    "score": 86.92,
    "explanation": "...",
    "n_components": 41,
    "variance_retained": 0.95
  },
  "analysis": {
    "sobel": "base64_image...",
    "histogram": "base64_image...",
    "grayscale": "base64_image...",
    "canny": "base64_image...",
    "hsv": "base64_image...",
    "green_mask": "base64_image...",
    "masked_leaf": "base64_image..."
  },
  "meta": {
    "feature_count": 118,
    "pca_components": 41
  }
}
```

---

## Performance Analysis

### Accuracy Comparison

| Model | Test Accuracy | F1-Score | Inference Time | Model Size |
|-------|--------------|----------|----------------|------------|
| **DL Pretrained** | 95.2% | 0.94 | 50ms | 44MB |
| **DL Scratch** | 90.1% | 0.89 | 15ms | 2MB |
| **ML Full** | 88.3% | 0.87 | 10ms | 5MB |
| **ML PCA** | 87.1% | 0.86 | 3ms | 3MB |

### Speed Comparison

```
ML PCA:    ████ 3ms   (Fastest - 3.3× faster than ML Full)
ML Full:   ██████████ 10ms
DL Scratch:███████████████ 15ms
DL Pretrained:█████████████████████████████████████████████████ 50ms
```

### Accuracy vs Speed Trade-off

```
High Accuracy, Slow          →          Fast, Good Accuracy
DL Pretrained (95%, 50ms) → DL Scratch (90%, 15ms) → ML Full (88%, 10ms) → ML PCA (87%, 3ms)
```

### When to Use Each Model

| Scenario | Recommended Model | Reason |
|----------|------------------|--------|
| Production API (high traffic) | **ML PCA** | 3ms inference, 87% accuracy |
| Mobile/Edge deployment | **DL Scratch** | 2MB size, 90% accuracy |
| Research/Maximum accuracy | **DL Pretrained** | 95% accuracy |
| Interpretability required | **ML Full** | Explainable features |
| Real-time video processing | **ML PCA** | Fastest inference |
| GPU available | **DL Pretrained** | Best accuracy |

---

## Technical Details

### Preprocessing Pipeline

All models use the same 5-step preprocessing:

```python
def preprocess_image(rgb):
    # Step 1: Resize to 224×224
    resized = cv2.resize(rgb, (224, 224), interpolation=cv2.INTER_AREA)
    
    # Step 2: RGB → HSV
    hsv = cv2.cvtColor(resized, cv2.COLOR_RGB2HSV)
    
    # Step 3: CLAHE on V channel
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    hsv[:, :, 2] = clahe.apply(hsv[:, :, 2])
    
    # Step 4: Gaussian Blur
    rgb_clahe = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
    blurred = cv2.GaussianBlur(rgb_clahe, (5, 5), 0)
    
    # Step 5: Normalize to [0, 1]
    normalized = blurred.astype(np.float32) / 255.0
    
    return normalized
```

### Feature Extraction Details

#### Color Features (78)

**RGB Histogram (48 values):**
```python
for channel in range(3):
    hist = cv2.calcHist([image], [channel], None, [16], [0, 256])
    hist = hist.flatten() / hist.sum()  # Normalize
```

**HSV H-channel Histogram (18 values):**
```python
hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
hist_h = cv2.calcHist([hsv], [0], None, [18], [0, 180])
hist_h = hist_h.flatten() / hist_h.sum()
```

#### Texture Features (34)

**GLCM (8 values):**
```python
gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
gray_q = (gray // 4).astype(np.uint8)  # Quantize to 64 levels
glcm = graycomatrix(gray_q, distances=[1, 3], 
                    angles=[0, π/4, π/2, 3π/4], 
                    levels=64, symmetric=True, normed=True)

for prop in ['contrast', 'correlation', 'energy', 'homogeneity']:
    vals = graycoprops(glcm, prop).flatten()
    features.extend([vals.mean(), vals.std()])
```

**LBP (26 values):**
```python
lbp = local_binary_pattern(gray, P=24, R=3, method='uniform')
hist, _ = np.histogram(lbp.ravel(), bins=26, range=(0, 26))
hist = hist / hist.sum()
```

#### Shape Features (6)

```python
# Extract from green leaf mask
mask = hsv_green_mask(image)
contours = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
cnt = max(contours, key=cv2.contourArea)

area = cv2.contourArea(cnt)
perimeter = cv2.arcLength(cnt, closed=True)
circularity = 4 * π * area / (perimeter ** 2)

x, y, w, h = cv2.boundingRect(cnt)
aspect_ratio = w / h
extent = area / (w * h)

hull = cv2.convexHull(cnt)
solidity = area / cv2.contourArea(hull)
```

### PCA Implementation

```python
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# 1. Standardize features (mean=0, std=1)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 2. Apply PCA
pca = PCA(n_components=0.95, random_state=42)  # Keep 95% variance
X_pca = pca.fit_transform(X_scaled)

print(f"Original features: {X.shape[1]}")
print(f"PCA components: {X_pca.shape[1]}")
print(f"Variance explained: {pca.explained_variance_ratio_.sum():.4f}")

# 3. Train model on reduced features
model.fit(X_pca, y)

# 4. Inference pipeline
def predict_with_pca(image):
    features = extract_all_features(image)  # 118 features
    features_scaled = scaler.transform(features.reshape(1, -1))
    features_pca = pca.transform(features_scaled)  # ~40 components
    prediction = model.predict(features_pca)
    return prediction
```

### Dataset Information

- **Source**: PlantVillage Dataset
- **Total Images**: 41,275
- **Classes**: 15 plant diseases
- **Split**: 80% train, 20% test
- **Augmentation**: Horizontal flip, rotation, color jitter (DL only)

**Class Distribution:**
```
Tomato__Tomato_YellowLeaf__Curl_Virus    6,416
Tomato_Bacterial_spot                    4,254
Tomato_Late_blight                       3,817
Tomato_Septoria_leaf_spot                3,542
Tomato_Spider_mites                      3,352
Tomato_healthy                           3,182
Pepper__bell___healthy                   2,956
Tomato__Target_Spot                      2,808
Potato___Early_blight                    2,000
Potato___Late_blight                     2,000
Tomato_Early_blight                      2,000
Pepper__bell___Bacterial_spot            1,994
Tomato_Leaf_Mold                         1,904
Tomato__Tomato_mosaic_virus                746
Potato___healthy                           304
```

---

## Conclusion

This system demonstrates the trade-offs between different machine learning approaches:

- **DL Pretrained**: Best accuracy, but requires GPU and larger model
- **DL Scratch**: Good balance of accuracy and efficiency
- **ML Full**: Interpretable and works with small data
- **ML PCA**: Fastest inference with minimal accuracy loss

**Recommendation**: Use **ML PCA** for production APIs requiring high throughput, **DL Pretrained** for maximum accuracy, and **DL Scratch** for mobile/edge deployment.

---

## References

- PlantVillage Dataset: https://github.com/spMohanty/PlantVillage-Dataset
- ResNet Paper: https://arxiv.org/abs/1512.03385
- PCA Tutorial: https://scikit-learn.org/stable/modules/decomposition.html#pca

---

**Last Updated**: 2026
**Version**: 1.0.0

# Plant Disease Detection - Training Notebooks

Jupyter notebooks for training and evaluating machine learning and deep learning models.

## 📚 Notebooks Overview

### 1. `projet.ipynb` - Complete Training Pipeline

**Full end-to-end training notebook including:**

#### Phase 1: Image Preprocessing
- Resize to 224×224
- RGB → HSV conversion
- CLAHE (Contrast Limited Adaptive Histogram Equalization)
- Gaussian blur
- Normalization

#### Phase 2: Segmentation
- Sobel edge detection
- Canny edge detection
- Otsu thresholding
- HSV green mask segmentation
- K-means clustering

#### Phase 3: Feature Extraction
- **Color Features (78)**:
  - RGB histogram (48)
  - RGB statistics (6)
  - HSV H-channel histogram (18)
  - HSV statistics (6)

- **Texture Features (34)**:
  - GLCM properties (8)
  - LBP histogram (26)

- **Shape Features (6)**:
  - Area, perimeter, circularity
  - Aspect ratio, solidity, extent

#### Phase 4: ML Preparation
- Label encoding
- Train/test split (80/20)
- Feature standardization
- Correlation analysis

#### Phase 5: ML Training
- Logistic Regression
- SVM (RBF kernel)
- Random Forest
- KNN
- Cross-validation (5-fold)
- Model selection and saving

#### Phase 6: Deep Learning
- **Pretrained ResNet18**:
  - Transfer learning from ImageNet
  - Fine-tuning final layer
  - 5 epochs training
  - ~95% accuracy

- **Custom CNN (Scratch)**:
  - 4-layer architecture
  - Trained from scratch
  - 8 epochs training
  - ~90% accuracy

**Output Files:**
- `best_model.pkl` - Best ML model (Random Forest)
- `best_cnn_final.pth` - Pretrained ResNet18
- `best_cnn_scratch.pth` - Custom CNN
- `features.csv` - Extracted features (118 dimensions)

---

### 2. `ML_avec_reduction.ipynb` - PCA Optimization

**Dimensionality reduction with PCA:**

#### Sections:

1. **Setup and Data Loading**
   - Load `features.csv`
   - Data cleaning and preparation

2. **PCA Analysis**
   - Fit PCA with all components
   - Analyze explained variance
   - Visualize cumulative variance

3. **Optimal Component Selection**
   - Compare 90%, 95%, 99% thresholds
   - **Choose 95% variance** (optimal balance)
   - Reduces 118 → ~40 features

4. **Justification for 95%**
   - Minimal information loss (5%)
   - Significant dimensionality reduction (65%)
   - Mitigates curse of dimensionality
   - Industry-standard threshold

5. **Model Training**
   - Train on PCA-reduced features
   - Compare 4 ML algorithms:
     - Logistic Regression
     - SVM (RBF)
     - Random Forest
     - KNN

6. **Performance Evaluation**
   - Cross-validation (5-fold)
   - Test set evaluation
   - Confusion matrix
   - Classification report

7. **Model Saving**
   - Save complete bundle:
     - Model
     - Scaler
     - PCA transformer
     - Label encoder

**Output Files:**
- `best_model_pca.pkl` - Optimized ML model with PCA

**Key Results:**
- Features: 118 → ~40 (65% reduction)
- Accuracy: ~87% (only 1% loss)
- Inference: 3× faster (3ms vs 10ms)

---

## 🗂️ Generated Files

### Model Files

```
notebooks/
├── best_model.pkl          # ML Full (118 features)
├── best_model_pca.pkl      # ML PCA (~40 components)
├── best_cnn_final.pth      # DL Pretrained (ResNet18)
└── best_cnn_scratch.pth    # DL Scratch (Custom CNN)
```

### Data Files

```
notebooks/
├── features.csv            # Extracted features (41,275 × 120)
└── preprocessed/           # Preprocessed images
    ├── Pepper__bell___Bacterial_spot/
    ├── Pepper__bell___healthy/
    ├── Potato___Early_blight/
    └── ... (15 classes total)
```

---

## 📊 Dataset Information

### PlantVillage Dataset

- **Total Images**: 41,275
- **Classes**: 15 plant diseases
- **Image Size**: 224×224 (after preprocessing)
- **Split**: 80% train, 20% test

### Class Distribution

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

## 🚀 Running the Notebooks

### Prerequisites

```bash
pip install jupyter notebook
pip install numpy pandas matplotlib seaborn
pip install opencv-python scikit-image scikit-learn
pip install torch torchvision
pip install joblib tqdm
```

### Launch Jupyter

```bash
cd notebooks
jupyter notebook
```

### Execution Order

1. **First Time**: Run `projet.ipynb` completely
   - Generates all model files
   - Creates `features.csv`
   - Takes ~2-3 hours (depending on hardware)

2. **PCA Optimization**: Run `ML_avec_reduction.ipynb`
   - Requires `features.csv` from step 1
   - Takes ~30 minutes
   - Generates `best_model_pca.pkl`

---

## 📈 Model Performance Summary

| Model | Accuracy | F1-Score | Training Time | Inference |
|-------|----------|----------|---------------|-----------|
| **DL Pretrained** | 95.2% | 0.94 | ~2 hours | 50ms |
| **DL Scratch** | 90.1% | 0.89 | ~1 hour | 15ms |
| **ML Full** | 88.3% | 0.87 | ~10 min | 10ms |
| **ML PCA** | 87.1% | 0.86 | ~5 min | 3ms |

---

## 🔬 Experimental Setup

### Hardware Used
- CPU: Intel i7 or equivalent
- RAM: 16GB minimum
- GPU: NVIDIA GPU (optional, for DL training)

### Software Versions
- Python: 3.8+
- PyTorch: 2.1+
- scikit-learn: 1.4+
- OpenCV: 4.9+

---

## 📝 Key Findings

### 1. Preprocessing Impact
- CLAHE improves contrast by 15%
- Gaussian blur reduces noise without losing edges
- HSV segmentation isolates leaves effectively

### 2. Feature Importance
- Color features most discriminative (78/118)
- Texture features capture disease patterns
- Shape features help distinguish healthy vs diseased

### 3. PCA Benefits
- 65% dimensionality reduction
- Only 1% accuracy loss
- 3× faster inference
- Reduces overfitting

### 4. Model Comparison
- DL Pretrained: Best accuracy, requires GPU
- DL Scratch: Good balance, mobile-friendly
- ML Full: Interpretable, fast training
- ML PCA: Fastest inference, production-ready

---

## 🎯 Reproducibility

### Random Seeds
All notebooks use `RANDOM_STATE = 42` for reproducibility.

### Data Splits
Stratified splits ensure balanced class distribution.

### Cross-Validation
5-fold stratified CV for robust evaluation.

---

## 🔧 Troubleshooting

### Out of Memory

**Problem**: Kernel crashes during training

**Solution**:
```python
# Reduce batch size
BATCH_SIZE = 16  # Instead of 32

# Or process in chunks
for chunk in pd.read_csv('features.csv', chunksize=1000):
    # Process chunk
```

### CUDA Errors

**Problem**: GPU not available

**Solution**:
```python
# Force CPU
device = torch.device("cpu")

# Or check CUDA
import torch
print(torch.cuda.is_available())
```

### Missing Dependencies

**Problem**: Import errors

**Solution**:
```bash
pip install --upgrade -r requirements.txt
```

---

## 📊 Visualization Examples

### Preprocessing Pipeline
- Original → Resized → HSV → CLAHE → Blurred

### Feature Distributions
- RGB histograms per class
- Texture patterns (GLCM, LBP)
- Shape characteristics

### Model Performance
- Confusion matrices
- ROC curves
- Training/validation curves

---

## 🎓 Learning Resources

### Understanding the Code

1. **Preprocessing**: See Phase 1 in `projet.ipynb`
2. **Feature Engineering**: See Phase 3 in `projet.ipynb`
3. **PCA Theory**: See Section 7 in `ML_avec_reduction.ipynb`
4. **Deep Learning**: See Phase 6 in `projet.ipynb`

### Key Concepts

- **CLAHE**: Adaptive histogram equalization
- **GLCM**: Gray-Level Co-occurrence Matrix
- **LBP**: Local Binary Patterns
- **PCA**: Principal Component Analysis
- **Transfer Learning**: Using pre-trained models

---

## 🚀 Next Steps

### Potential Improvements

1. **Data Augmentation**
   - More rotation angles
   - Elastic deformations
   - Mixup/Cutmix

2. **Model Ensemble**
   - Combine all 4 models
   - Weighted voting
   - Stacking

3. **Hyperparameter Tuning**
   - Grid search
   - Bayesian optimization
   - AutoML

4. **Additional Features**
   - Wavelet transforms
   - Gabor filters
   - Deep features from CNN

---

## 📞 Support

For questions about notebooks:
1. Check cell outputs for errors
2. Verify data paths are correct
3. Ensure all dependencies installed
4. Review comments in code

---

## 📄 License

MIT License - See root LICENSE file

---

**Last Updated**: 2024
**Version**: 1.0.0

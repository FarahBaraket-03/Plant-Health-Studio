# Quick Start Guide - Plant Disease Detection System

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Python 3.8+
- Node.js 18+
- Git

---

## Step 1: Clone & Navigate

```bash
cd projet_img
```

---

## Step 2: Setup Backend (2 minutes)

```bash
# Navigate to backend
cd app/backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install fastapi uvicorn python-multipart torch torchvision opencv-python scikit-image scikit-learn joblib numpy pandas pillow

# Start backend server
python main.py
```

✅ Backend running on **http://localhost:8000**

---

## Step 3: Setup Frontend (2 minutes)

Open a **new terminal**:

```bash
# Navigate to frontend
cd app/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running on **http://localhost:3000**

---

## Step 4: Test the System (1 minute)

1. Open browser: **http://localhost:3000**
2. Click "Upload" or drag-and-drop a leaf image
3. Click "Classify This Leaf"
4. View predictions from 4 different models!

---

## 📊 What You'll See

### 4 Model Predictions:
1. **DL Pretrained** - Highest accuracy (~95%)
2. **DL Scratch** - Fast and lightweight (~90%)
3. **ML Full** - Interpretable features (~88%)
4. **ML + PCA** - Fastest inference (~87%, 3ms) ⚡

### 7 Image Analysis Visualizations:
- Sobel Edge Detection
- RGB Histogram
- Grayscale
- Canny Edge Detection
- HSV Color Space
- Green Leaf Mask
- Segmented Leaf

---

## 🎯 Quick API Test

```bash
# Test with curl
curl -X POST "http://localhost:8000/predict" \
  -F "file=@path/to/your/leaf_image.jpg"
```

Or use Python:

```python
import requests

url = "http://localhost:8000/predict"
files = {"file": open("leaf_image.jpg", "rb")}
response = requests.post(url, files=files)
print(response.json())
```

---

## 📚 View Documentation

Navigate to: **http://localhost:3000/docs**

Comprehensive technical documentation including:
- Model architectures
- Performance comparisons
- Feature extraction details
- When to use each model

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Models not loading
```bash
# Check if model files exist
ls notebooks/best_model.pkl
ls notebooks/best_model_pca.pkl
ls app/backend/models/best_cnn_final.pth
ls app/backend/models/best_cnn_scratch.pth
```

**Solution**: Ensure all model files are in correct locations

---

**Problem**: Import errors
```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

---

### Frontend Issues

**Problem**: Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

---

**Problem**: Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📁 Required Files

Ensure these files exist:

```
notebooks/
├── best_model.pkl          # ML Full model
└── best_model_pca.pkl      # ML PCA model (NEW!)

app/backend/models/
├── best_cnn_final.pth      # DL Pretrained
└── best_cnn_scratch.pth    # DL Scratch
```

---

## 🎓 Learn More

- **Full Documentation**: See `DOCUMENTATION.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Training Notebooks**: 
  - `notebooks/projet.ipynb` - DL and ML training
  - `notebooks/ML_avec_reduction.ipynb` - PCA training

---

## 🌟 Key Features

### Why Use This System?

✅ **4 Models in 1**: Compare different approaches
✅ **Fast Inference**: 3ms with PCA optimization
✅ **Visual Analysis**: 7 image transformations
✅ **Production Ready**: REST API + Modern UI
✅ **Well Documented**: Comprehensive technical docs

---

## 💡 Quick Tips

### For Best Results:
- Use clear, well-lit leaf images
- Ensure leaf fills most of the frame
- Avoid blurry or low-resolution images
- Green background works best for segmentation

### Model Selection:
- **Need speed?** → Use ML + PCA (3ms)
- **Need accuracy?** → Use DL Pretrained (95%)
- **Need mobile?** → Use DL Scratch (2MB)
- **Need explanation?** → Use ML Full (interpretable)

---

## 🚀 Production Deployment

### Docker (Recommended)

```dockerfile
# Backend Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY app/backend /app
RUN pip install -r requirements.txt
CMD ["python", "main.py"]
```

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY app/frontend /app
RUN npm install && npm run build
CMD ["npm", "start"]
```

### Environment Variables

```bash
# Backend
export API_HOST=0.0.0.0
export API_PORT=8000

# Frontend
export NEXT_PUBLIC_API_URL=http://your-backend-url:8000
```

---

## 📞 Support

For issues or questions:
1. Check `DOCUMENTATION.md` for technical details
2. Review `IMPLEMENTATION_SUMMARY.md` for architecture
3. Examine training notebooks for model details

---

## ✅ Success Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can upload and classify images
- [ ] All 4 models show predictions
- [ ] Image analysis displays 7 visualizations
- [ ] Documentation page accessible at /docs

---

**Ready to classify plant diseases!** 🌿🔬

Upload your first image and explore the power of multi-model machine learning!

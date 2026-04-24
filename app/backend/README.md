# Plant Disease Detection - Backend API

FastAPI backend for plant disease classification using multiple ML/DL models.

## 🚀 Features

- **4 Classification Models**:
  - Deep Learning Pretrained (ResNet18)
  - Deep Learning Scratch (Custom CNN)
  - Machine Learning Full (118 features)
  - Machine Learning PCA (40 components)

- **Image Analysis**: 7 preprocessing visualizations
- **REST API**: Simple `/predict` endpoint
- **Production Ready**: Optimized for deployment

---

## 📋 Prerequisites

- Python 3.8+
- pip or conda

---

## 🔧 Local Development Setup

### 1. Create Virtual Environment

```bash
# Navigate to backend directory
cd app/backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Prepare Model Files

Ensure these model files exist:

```
notebooks/
├── best_model.pkl          # ML Full model
└── best_model_pca.pkl      # ML PCA model

app/backend/models/
├── best_cnn_final.pth      # DL Pretrained
└── best_cnn_scratch.pth    # DL Scratch
```

### 4. Run Development Server

```bash
python main.py
```

Server runs on: **http://localhost:8000**

API Documentation: **http://localhost:8000/docs**

---

## 🌐 Deployment to Render

### Step 1: Prepare Repository

Ensure your repository has:
- `app/backend/requirements.txt`
- `app/backend/main.py`
- `app/backend/preprocessing.py`
- Model files in correct locations

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository

### Step 3: Configure Service

**Basic Settings:**
- **Name**: `plant-disease-api` (or your choice)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your branch)
- **Root Directory**: `app/backend`
- **Runtime**: `Python 3`

**Build & Deploy:**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Environment Variables:**
```
PYTHON_VERSION=3.9.18
```

**Instance Type:**
- Free tier: Limited resources (may be slow)
- Starter ($7/month): Recommended for production
- Standard: For high traffic

### Step 4: Deploy

Click **"Create Web Service"**

Render will:
1. Clone your repository
2. Install dependencies
3. Start the server
4. Provide a public URL: `https://your-service.onrender.com`

### Step 5: Update Frontend

Update your frontend's API URL:

```bash
# In app/frontend/.env.local
NEXT_PUBLIC_API_URL=https://your-service.onrender.com
```

---

## 📡 API Usage

### Endpoint: POST /predict

Upload an image and get predictions from all 4 models.

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/predict" \
  -F "file=@leaf_image.jpg"
```

**Python Example:**
```python
import requests

url = "http://localhost:8000/predict"
files = {"file": open("leaf_image.jpg", "rb")}
response = requests.post(url, files=files)
result = response.json()

print(f"DL Pretrained: {result['dl']['class']}")
print(f"DL Scratch: {result['dl_scratch']['class']}")
print(f"ML Full: {result['ml']['class']}")
print(f"ML PCA: {result['ml_pca']['class']}")
```

**Response Format:**
```json
{
  "dl": {
    "class": "Tomato_Late_blight",
    "explanation": "..."
  },
  "dl_scratch": {
    "class": "Tomato_Late_blight",
    "explanation": "..."
  },
  "ml": {
    "class": "Tomato_Late_blight",
    "explanation": "..."
  },
  "ml_pca": {
    "class": "Tomato_Late_blight",
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

## 🗂️ Project Structure

```
app/backend/
├── main.py                 # FastAPI application
├── preprocessing.py        # Image preprocessing & feature extraction
├── requirements.txt        # Python dependencies
├── models/                 # Deep learning model files
│   ├── best_cnn_final.pth
│   └── best_cnn_scratch.pth
└── README.md              # This file
```

---

## 🔍 Model Details

### Deep Learning Pretrained
- **Architecture**: ResNet18 with ImageNet weights
- **Accuracy**: ~95%
- **Inference**: ~50ms
- **Size**: 44MB

### Deep Learning Scratch
- **Architecture**: Custom 4-layer CNN
- **Accuracy**: ~90%
- **Inference**: ~15ms
- **Size**: 2MB

### Machine Learning Full
- **Features**: 118 (color, texture, shape)
- **Accuracy**: ~88%
- **Inference**: ~10ms
- **Size**: 5MB

### Machine Learning PCA
- **Features**: ~40 components (95% variance)
- **Accuracy**: ~87%
- **Inference**: ~3ms (3× faster)
- **Size**: 3MB

---

## 🐛 Troubleshooting

### Models Not Loading

**Problem**: `Model not loaded` error

**Solution**:
```bash
# Check if model files exist
ls ../../notebooks/best_model.pkl
ls ../../notebooks/best_model_pca.pkl
ls models/best_cnn_final.pth
ls models/best_cnn_scratch.pth
```

### Import Errors

**Problem**: `ModuleNotFoundError`

**Solution**:
```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

### Port Already in Use

**Problem**: Port 8000 is occupied

**Solution**:
```bash
# Use different port
uvicorn main:app --port 8001
```

### Memory Issues on Render

**Problem**: Out of memory errors

**Solution**:
- Upgrade to Starter plan ($7/month)
- Or disable some models in `main.py`

---

## 📊 Performance Optimization

### For Production:

1. **Use ML PCA model** for fastest inference (3ms)
2. **Enable caching** for repeated predictions
3. **Use CDN** for static assets
4. **Monitor memory** usage on Render

### Render-Specific Tips:

- Free tier sleeps after 15 min inactivity (cold start ~30s)
- Starter plan keeps service always active
- Use environment variables for configuration
- Monitor logs in Render dashboard

---

## 🔐 Security Notes

- API is currently open (no authentication)
- For production, consider adding:
  - API key authentication
  - Rate limiting
  - CORS restrictions
  - Input validation

---

## 📝 Environment Variables

Optional environment variables:

```bash
# Port (Render sets this automatically)
PORT=8000

# Python version
PYTHON_VERSION=3.9.18

# Model paths (if different)
ML_MODEL_PATH=../../notebooks/best_model.pkl
ML_PCA_MODEL_PATH=../../notebooks/best_model_pca.pkl
```

---

## 🚀 Quick Deploy Checklist

- [ ] All model files in correct locations
- [ ] `requirements.txt` is up to date
- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Service deployed successfully
- [ ] Test API endpoint
- [ ] Update frontend API URL

---

## 📞 Support

For issues:
1. Check Render logs in dashboard
2. Verify model files exist
3. Test locally first
4. Check Python version compatibility

---

## 📄 License

MIT License - See root LICENSE file

---

**Last Updated**: 2024
**Version**: 1.0.0

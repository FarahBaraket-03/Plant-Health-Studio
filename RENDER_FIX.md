# Fix: ML-PCA Model Not Loading on Render

## Problem
```
ML-PCA model not loaded
INFO: "POST /predict HTTP/1.1" 500 Internal Server Error
```

## Root Cause
The model files are not being found on Render. Possible reasons:
1. Models not included in Git repository (too large)
2. Models in wrong directory
3. Path resolution issues on Render

## Solution Steps

### Step 1: Check Model Files Locally
```bash
cd app/backend
python check_models.py
```

This will show you which models exist and their sizes.

### Step 2: Verify Models are in Git
```bash
# Check if models are tracked
git ls-files app/backend/models/

# Should show:
# app/backend/models/best_model_pca.pkl
# app/backend/models/best_cnn_final.pth
# app/backend/models/best_cnn_scratch.pth
```

### Step 3: If Models are Too Large for Git

**Option A: Use Git LFS (Recommended)**
```bash
# Install Git LFS
git lfs install

# Track model files
git lfs track "*.pkl"
git lfs track "*.pth"

# Add .gitattributes
git add .gitattributes

# Add models
git add app/backend/models/
git commit -m "Add models with Git LFS"
git push origin main
```

**Option B: Upload Models Manually to Render**
1. Go to Render Dashboard → Your Service → Environment
2. Add environment variable with model download URL
3. Add build command to download models:
```bash
# In Render build command:
pip install -r app/backend/requirements.txt && python app/backend/download_models.py
```

**Option C: Use External Storage (S3, Google Drive)**
Create `app/backend/download_models.py`:
```python
import urllib.request
from pathlib import Path

MODELS_DIR = Path(__file__).parent / "models"
MODELS_DIR.mkdir(exist_ok=True)

# Download from your storage
models = {
    "best_model_pca.pkl": "YOUR_DOWNLOAD_URL_HERE",
    "best_cnn_final.pth": "YOUR_DOWNLOAD_URL_HERE",
    "best_cnn_scratch.pth": "YOUR_DOWNLOAD_URL_HERE",
}

for filename, url in models.items():
    print(f"Downloading {filename}...")
    urllib.request.urlretrieve(url, MODELS_DIR / filename)
    print(f"✓ {filename} downloaded")
```

### Step 4: Update Render Configuration

**Build Command:**
```bash
pip install -r app/backend/requirements.txt
```

**Start Command:**
```bash
cd app/backend && python main.py
```

Or if using uvicorn directly:
```bash
cd app/backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Step 5: Check Render Logs

After deploying, check the startup logs for:
```
STARTING PLANT DISEASE DETECTION API
Working directory: /opt/render/project/src
Backend models dir: /opt/render/project/src/app/backend/models
Backend models dir exists: True
Files in models dir: [...]
```

### Step 6: Test Health Endpoint

Visit: `https://plant-disease-api-j1di.onrender.com/health`

Should return:
```json
{
  "status": "healthy",
  "environment": "Render",
  "models": {
    "ml_loaded": false,
    "ml_pca_loaded": true,
    "dl_loaded": true,
    "dl_scratch_loaded": true
  },
  "labels_count": 15
}
```

## Quick Fix Commands

```bash
# 1. Commit current changes
git add .
git commit -m "fix: improve model loading with better paths and logging"
git push origin main

# 2. If models are missing from Git, add them
git add app/backend/models/*.pkl app/backend/models/*.pth
git commit -m "add: model files for deployment"
git push origin main

# 3. Check Render logs
# Go to Render Dashboard → Your Service → Logs
# Look for "ML-PCA model not found" or "Failed to load ML-PCA model"
```

## Verification

After deployment, test the API:
```bash
# Health check
curl https://plant-disease-api-j1di.onrender.com/health

# Test prediction (with an image)
curl -X POST https://plant-disease-api-j1di.onrender.com/predict \
  -F "file=@test_image.jpg"
```

## Expected Behavior on Render

✅ ML (Full): Disabled (to save memory)
✅ ML-PCA: Loaded and working
✅ DL Pretrained: Loaded and working
✅ DL Scratch: Loaded and working

---

**Need Help?**
Check the Render logs for the exact error message and file paths.

# 🌿 Plant Disease Detection System

A comprehensive machine learning system for classifying plant diseases using multiple model architectures. Features 4 different models (Deep Learning + Machine Learning) with real-time image analysis and a modern web interface.

![Plant Disease Detection](https://img.shields.io/badge/Status-Production%20Ready-success)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 👾 Overview

<img width="1860" height="885" alt="Capture d&#39;écran 2026-04-24 044331" src="https://github.com/user-attachments/assets/5830a13a-72aa-43d5-95ea-55dcb79a7df2" />
<br></br>
<img width="1900" height="879" alt="Capture d&#39;écran 2026-04-26 143635" src="https://github.com/user-attachments/assets/22e3ce65-6c01-440a-a4db-e78823d2b435" />
<br></br>
<img width="1862" height="884" alt="Capture d&#39;écran 2026-04-24 044319" src="https://github.com/user-attachments/assets/dad2a7d5-65b2-4d38-b4a5-98347d6f5e7b" />

---

## 🌟 Features

### 4 Classification Models
- **Deep Learning Pretrained** (ResNet18): ~95% accuracy
- **Deep Learning Scratch** (Custom CNN): ~90% accuracy  
- **Machine Learning Full** (118 features): ~88% accuracy
- **Machine Learning PCA** (40 components): ~87% accuracy, 3× faster

### Image Analysis
- 7 preprocessing visualizations
- Feature extraction breakdown
- Technical explanations

### Modern Web Interface
- Real-time classification
- Multi-model comparison
- Responsive design
- Comprehensive documentation

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd projet_img
```

### 2. Setup Backend

```bash
cd app/backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Backend runs on: **http://localhost:8000**

### 3. Setup Frontend

```bash
cd app/frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:3000**

### 4. Test the System

1. Open http://localhost:3000
2. Upload a leaf image
3. View predictions from all 4 models!

---

## 📁 Project Structure

```
projet_img/
├── app/
│   ├── backend/              # FastAPI backend
│   │   ├── main.py          # API server
│   │   ├── preprocessing.py # Feature extraction
│   │   ├── requirements.txt # Python dependencies
│   │   ├── models/          # DL model files
│   │   └── README.md        # Backend documentation
│   │
│   └── frontend/            # Next.js frontend
│       ├── app/             # Pages and components
│       ├── package.json     # Node dependencies
│       └── README.md        # Frontend documentation
│
├── notebooks/               # Training notebooks
│   ├── projet.ipynb        # Full training pipeline
│   ├── ML_avec_reduction.ipynb  # PCA optimization
│   ├── best_model.pkl      # ML Full model
│   ├── best_model_pca.pkl  # ML PCA model
│   ├── best_cnn_final.pth  # DL Pretrained
│   ├── best_cnn_scratch.pth # DL Scratch
│   └── README.md           # Notebooks documentation
│
├── DOCUMENTATION.md         # Complete technical docs
├── QUICK_START.md          # 5-minute setup guide
└── README.md               # This file
```

---

## 📊 Model Comparison

| Model | Accuracy | Inference Time | Model Size | Best For |
|-------|----------|----------------|------------|----------|
| **DL Pretrained** | ~97% | 50ms | 44MB | Maximum accuracy |
| **DL Scratch** | ~88% | 15ms | 2MB | Mobile/Edge |
| **ML Full** | ~98% | 18ms | 5MB | Interpretability |
| **ML PCA** | ~90% | 3ms | 3MB | Production APIs |

---

## 🌐 Deployment

### Backend (Render)

1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - **Root Directory**: `app/backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Deploy!

See [app/backend/README.md](app/backend/README.md) for detailed instructions.

### Frontend (Vercel)

1. Create account on [Vercel](https://vercel.com)
2. Import GitHub repository
3. Configure:
   - **Root Directory**: `app/frontend`
   - **Framework**: Next.js
   - **Environment Variable**: `NEXT_PUBLIC_API_URL=<your-backend-url>`
4. Deploy!

See [app/frontend/README.md](app/frontend/README.md) for detailed instructions.

---

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in 5 minutes
- **[DOCUMENTATION.md](DOCUMENTATION.md)** - Complete technical documentation
- **[app/backend/README.md](app/backend/README.md)** - Backend API documentation
- **[app/frontend/README.md](app/frontend/README.md)** - Frontend documentation
- **[notebooks/README.md](notebooks/README.md)** - Training notebooks guide

---

## 🔬 Technical Details

### Preprocessing Pipeline (5 steps)
1. Resize to 224×224
2. RGB → HSV conversion
3. CLAHE on V channel
4. Gaussian blur (5×5)
5. Normalize to [0, 1]

### Feature Extraction (118 features)
- **Color (78)**: RGB/HSV histograms + statistics
- **Texture (34)**: GLCM + LBP
- **Shape (6)**: Area, perimeter, circularity, etc.

### PCA Optimization
- Reduces 118 → 40 features (65% reduction)
- Retains 95% variance
- 3× faster inference
- Only 1% accuracy loss

---

## 🎯 Use Cases

### Production API
**Recommended**: ML PCA
- Fastest inference (3ms)
- Handles high traffic
- Minimal accuracy loss

### Mobile App
**Recommended**: DL Scratch
- Small size (2MB)
- Good accuracy (90%)
- Fast on mobile devices

### Research
**Recommended**: DL Pretrained
- Highest accuracy (95%)
- Best for analysis
- Detailed feature learning

### Interpretability
**Recommended**: ML Full
- Explainable features
- Feature importance
- Domain knowledge integration

---

## 🛠️ Development

### Prerequisites
- Python 3.8+
- Node.js 18+
- pip and npm

### Install Dependencies

**Backend:**
```bash
cd app/backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd app/frontend
npm install
```

### Run Tests

**Backend:**
```bash
# Test API endpoint
curl -X POST "http://localhost:8000/predict" \
  -F "file=@test_image.jpg"
```

**Frontend:**
```bash
# Build test
npm run build
```

---

## 📈 Performance Metrics

### Accuracy by Class

All models achieve >85% accuracy across 15 plant disease classes:
- Tomato diseases (9 classes)
- Potato diseases (3 classes)
- Pepper diseases (2 classes)
- Healthy plants (1 class)

### Inference Speed

```
ML PCA:        ████ 3ms   (Fastest)
ML Full:       ██████████ 10ms
DL Scratch:    ███████████████ 15ms
DL Pretrained: █████████████████████████████████████████████████ 50ms
```

---

## 🐛 Troubleshooting

### Backend Issues

**Models not loading:**
```bash
# Check model files exist
ls notebooks/best_model*.pkl
ls app/backend/models/*.pth
```

**Port already in use:**
```bash
# Use different port
uvicorn main:app --port 8001
```

### Frontend Issues

**API connection failed:**
```bash
# Check .env.local
cat app/frontend/.env.local

# Verify backend is running
curl http://localhost:8000/docs
```

**Build errors:**
```bash
# Clear cache
rm -rf .next
npm run dev
```

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- **PlantVillage Dataset**: Training data source
- **PyTorch**: Deep learning framework
- **scikit-learn**: Machine learning library
- **FastAPI**: Backend framework
- **Next.js**: Frontend framework

---

## 📞 Support

For issues or questions:
1. Check documentation in respective folders
2. Review troubleshooting sections
3. Open an issue on GitHub

---

## 🎓 Citation

If you use this project in your research, please cite:

```bibtex
@software{plant_disease_detection,
  title = {Plant Disease Detection System},
  year = {2026},
  author = {Your Name},
  url = {https://github.com/yourusername/projet_img}
}
```

---

**Last Updated**: 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅

# Plant Health Studio - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Prerequisites
- Python 3.9+
- Node.js 18+
- Git

### 1. Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd Plant-Health-Studio

# Backend setup
cd app/backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
```

### 2. Start Services

**Terminal 1 - Backend:**
```bash
cd app/backend
source .venv/bin/activate  # Windows: .venv\Scripts\activate
python main.py
# Backend runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd app/frontend
npm run dev
# Frontend runs on http://localhost:3000
```

### 3. Test the Application

1. Open http://localhost:3000
2. Upload a plant leaf image
3. Get instant disease predictions from 4 AI models

## 📊 Models Included

| Model | Type | Accuracy | Speed |
|-------|------|----------|-------|
| **ML (Random Forest)** | Traditional ML | 94% | Fast |
| **ML-PCA (KNN K=15)** | Dimensionality Reduction | 92% | Very Fast |
| **DL Pretrained (ResNet18)** | Transfer Learning | 95%+ | Medium |
| **DL Scratch (CNN)** | Custom CNN | 88% | Fast |

## 🎯 Key Features

- **4 AI Models**: Compare predictions from multiple approaches
- **Real-time Analysis**: Instant disease detection
- **Visual Insights**: See edge detection, histograms, segmentation
- **15 Disease Classes**: Covers tomato, potato, and pepper diseases
- **Production Ready**: Optimized for deployment

## 📁 Project Structure

```
Plant-Health-Studio/
├── app/
│   ├── backend/          # FastAPI server
│   │   ├── main.py       # API endpoints
│   │   ├── preprocessing.py
│   │   └── models/       # Trained models (.pth, .pkl)
│   └── frontend/         # Next.js app
│       ├── app/
│       │   └── page.tsx  # Main UI
│       └── package.json
├── notebooks/
│   ├── projet.ipynb      # Training notebook
│   └── data/             # Dataset
└── README.md
```

## 🔧 Common Issues

**Backend won't start:**
- Ensure Python 3.9+ is installed
- Check all models exist in `app/backend/models/`
- Verify virtual environment is activated

**Frontend won't start:**
- Run `npm install` in `app/frontend/`
- Check Node.js version: `node --version` (need 18+)

**Models not loading:**
- Download models from releases or retrain using `notebooks/projet.ipynb`
- Place in `app/backend/models/` directory

## 📚 Next Steps

- **Training**: Open `notebooks/projet.ipynb` to retrain models
- **Deployment**: See README.md for Vercel/Render deployment
- **Customization**: Modify `app/frontend/app/page.tsx` for UI changes

## 🆘 Need Help?

- Check README.md for detailed documentation
- Review `notebooks/projet.ipynb` for model training details
- Open an issue on GitHub

---

**Ready in 5 minutes!** 🎉

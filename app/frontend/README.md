# Plant Disease Detection - Frontend

Modern Next.js web application for plant disease classification with real-time image analysis.

## 🚀 Features

- **Multi-Model Comparison**: View predictions from 4 different models
- **Image Analysis**: 7 preprocessing visualizations
- **Technical Documentation**: Comprehensive model explanations
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Processing**: Instant classification results

---

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

---

## 🔧 Local Development Setup

### 1. Install Dependencies

```bash
# Navigate to frontend directory
cd app/frontend

# Install packages
npm install
```

### 2. Configure API URL

Create `.env.local` file:

```bash
# For local development
NEXT_PUBLIC_API_URL=http://localhost:8000

# For production (after deploying backend)
# NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### 3. Run Development Server

```bash
npm run dev
```

Open: **http://localhost:3000**

---

## 🌐 Deployment to Vercel

### Step 1: Prepare Repository

Ensure your code is pushed to GitHub.

### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure project:

**Framework Preset**: Next.js

**Root Directory**: `app/frontend`

**Build Command**: `npm run build`

**Output Directory**: `.next`

**Install Command**: `npm install`

### Step 3: Environment Variables

Add in Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### Step 4: Deploy

Click **"Deploy"**

Vercel will provide a URL: `https://your-project.vercel.app`

---

## 🎨 Pages

### Home Page (`/`)
- Image upload interface
- Model predictions display
- Image analysis visualizations
- Technical details

### Documentation Page (`/docs`)
- Model architecture comparisons
- Performance metrics
- Feature extraction details
- When to use each model

---

## 🗂️ Project Structure

```
app/frontend/
├── app/
│   ├── page.tsx           # Main classification page
│   ├── docs/
│   │   └── page.tsx       # Documentation page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── public/                # Static assets
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── README.md             # This file
```

---

## 🎨 Styling

Built with:
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations
- **Lucide Icons**: Beautiful icon set

### Color Palette

```css
Primary: #5D7052 (Green)
Secondary: #C18C5D (Brown)
Background: #FEFEFA (Off-white)
Foreground: #0F172A (Dark slate)
```

---

## 🔧 Configuration Files

### tailwind.config.js

Custom theme configuration with plant-inspired colors.

### tsconfig.json

TypeScript configuration for Next.js.

### next.config.js

Next.js configuration (if needed for custom settings).

---

## 📱 Responsive Design

Breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All components are fully responsive.

---

## 🧪 Testing Locally

### Test with Backend

1. Start backend: `cd app/backend && python main.py`
2. Start frontend: `cd app/frontend && npm run dev`
3. Upload test image
4. Verify all 4 models return predictions

### Test Image Analysis

- Check all 7 visualizations display
- Verify technical details section
- Test documentation page navigation

---

## 🚀 Production Build

### Build Locally

```bash
npm run build
npm start
```

### Build on Vercel

Automatic on every push to main branch.

---

## 🔍 Features Breakdown

### Image Upload
- Drag & drop support
- File type validation (JPG, PNG, WEBP)
- Preview before classification
- Replace image functionality

### Model Predictions
- **DL Pretrained**: ResNet18 results
- **DL Scratch**: Custom CNN results
- **ML Full**: 118-feature classification
- **ML PCA**: Optimized 40-component classification

### Image Analysis
1. **Sobel Edge Detection**: Gradient-based edges
2. **RGB Histogram**: Color distribution
3. **Grayscale**: Luminosity conversion
4. **Canny Edge Detection**: Precise edge detection
5. **HSV Color Space**: Hue-Saturation-Value
6. **Green Leaf Mask**: Segmentation mask
7. **Segmented Leaf**: Isolated leaf region

### Technical Details
- Preprocessing pipeline explanation
- Feature extraction breakdown
- GLCM and LBP texture analysis
- Shape feature descriptions

---

## 🐛 Troubleshooting

### API Connection Failed

**Problem**: Cannot connect to backend

**Solution**:
```bash
# Check .env.local
cat .env.local

# Verify backend is running
curl http://localhost:8000/docs
```

### Build Errors

**Problem**: Build fails on Vercel

**Solution**:
```bash
# Test build locally
npm run build

# Check for TypeScript errors
npm run type-check
```

### Styling Issues

**Problem**: Styles not applying

**Solution**:
```bash
# Rebuild Tailwind
npm run dev

# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## 📊 Performance

### Lighthouse Scores (Target)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### Optimization Tips
- Images are optimized with Next.js Image
- Code splitting with dynamic imports
- Lazy loading for heavy components
- Efficient re-renders with React hooks

---

## 🔐 Security

### CORS Configuration

Backend allows all origins by default. For production:

```python
# In backend main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],
    allow_methods=["POST"],
    allow_headers=["*"],
)
```

---

## 🎯 User Flow

1. **Upload Image**: User uploads leaf photo
2. **Processing**: Image sent to backend API
3. **Analysis**: Backend processes with 4 models
4. **Results**: Display predictions and visualizations
5. **Explore**: User can view technical details
6. **Documentation**: Learn about model architectures

---

## 📝 Environment Variables

```bash
# Required
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional (for analytics, etc.)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🚀 Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed and URL obtained
- [ ] `.env.local` configured with backend URL
- [ ] Test locally with `npm run dev`
- [ ] Build succeeds with `npm run build`
- [ ] Vercel project created
- [ ] Environment variable set in Vercel
- [ ] Deploy successful
- [ ] Test production URL

---

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: '#YOUR_COLOR',
  secondary: '#YOUR_COLOR',
}
```

### Add New Page

Create file in `app/` directory:

```typescript
// app/about/page.tsx
export default function About() {
  return <div>About Page</div>
}
```

### Modify Layout

Edit `app/layout.tsx` for global changes.

---

## 📞 Support

For issues:
1. Check browser console for errors
2. Verify API URL is correct
3. Test backend endpoint directly
4. Check Vercel deployment logs

---

## 📄 License

MIT License - See root LICENSE file

---

**Last Updated**: 2024
**Version**: 1.0.0

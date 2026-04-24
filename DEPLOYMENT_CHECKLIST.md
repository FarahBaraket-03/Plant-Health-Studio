# 🚀 Deployment Checklist

Complete checklist for deploying the Plant Disease Detection System to production.

---

## 📋 Pre-Deployment

### Local Testing
- [ ] Backend runs successfully on `http://localhost:8000`
- [ ] Frontend runs successfully on `http://localhost:3000`
- [ ] All 4 models load correctly
- [ ] Test image upload works
- [ ] All 4 model predictions display
- [ ] Image analysis (7 visualizations) displays
- [ ] Documentation page accessible at `/docs`
- [ ] No console errors in browser
- [ ] API responds correctly to test requests

### Code Quality
- [ ] All unnecessary files removed
- [ ] `.gitignore` properly configured
- [ ] README files in all major folders
- [ ] Code committed to Git
- [ ] Repository pushed to GitHub

### Model Files
- [ ] `notebooks/best_model.pkl` exists
- [ ] `notebooks/best_model_pca.pkl` exists
- [ ] `app/backend/models/best_cnn_final.pth` exists
- [ ] `app/backend/models/best_cnn_scratch.pth` exists

---

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Repository
- [ ] Code pushed to GitHub
- [ ] `app/backend/requirements.txt` exists
- [ ] `app/backend/main.py` exists
- [ ] `app/backend/preprocessing.py` exists
- [ ] Model files in correct locations

### Step 2: Create Render Account
- [ ] Sign up at https://render.com
- [ ] Verify email address
- [ ] Connect GitHub account

### Step 3: Create Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Select your GitHub repository
- [ ] Grant Render access to repository

### Step 4: Configure Service

**Basic Settings:**
- [ ] Name: `plant-disease-api` (or your choice)
- [ ] Region: Selected (choose closest to users)
- [ ] Branch: `main`
- [ ] Root Directory: `app/backend`
- [ ] Runtime: `Python 3`

**Build & Deploy:**
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Environment Variables:**
- [ ] `PYTHON_VERSION` = `3.9.18`

**Instance Type:**
- [ ] Free (for testing) OR
- [ ] Starter ($7/month - recommended) OR
- [ ] Standard (for high traffic)

### Step 5: Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (~5-10 minutes)
- [ ] Check logs for errors
- [ ] Note the provided URL: `https://your-service.onrender.com`

### Step 6: Test Backend
- [ ] Visit `https://your-service.onrender.com/docs`
- [ ] API documentation loads
- [ ] Test `/predict` endpoint with curl:
  ```bash
  curl -X POST "https://your-service.onrender.com/predict" \
    -F "file=@test_image.jpg"
  ```
- [ ] Response contains all 4 model predictions
- [ ] No errors in Render logs

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend
- [ ] Backend deployed and URL obtained
- [ ] Frontend tested locally
- [ ] Code pushed to GitHub

### Step 2: Create Vercel Account
- [ ] Sign up at https://vercel.com
- [ ] Connect GitHub account

### Step 3: Import Project
- [ ] Click "Add New..." → "Project"
- [ ] Select your GitHub repository
- [ ] Grant Vercel access

### Step 4: Configure Project

**Framework Preset:**
- [ ] Framework: `Next.js`

**Root Directory:**
- [ ] Root Directory: `app/frontend`

**Build Settings:**
- [ ] Build Command: `npm run build` (auto-detected)
- [ ] Output Directory: `.next` (auto-detected)
- [ ] Install Command: `npm install` (auto-detected)

**Environment Variables:**
- [ ] Add `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com`

### Step 5: Deploy
- [ ] Click "Deploy"
- [ ] Wait for build (~2-5 minutes)
- [ ] Note the provided URL: `https://your-project.vercel.app`

### Step 6: Test Frontend
- [ ] Visit `https://your-project.vercel.app`
- [ ] Page loads correctly
- [ ] Upload test image
- [ ] All 4 models return predictions
- [ ] Image analysis displays
- [ ] Navigate to `/docs` page
- [ ] Documentation loads correctly
- [ ] No console errors

---

## 🔗 Post-Deployment

### Update Documentation
- [ ] Update README with production URLs
- [ ] Document any deployment issues encountered
- [ ] Update environment variable examples

### Performance Testing
- [ ] Test with multiple images
- [ ] Check response times
- [ ] Verify all models work consistently
- [ ] Test on different devices (mobile, tablet, desktop)
- [ ] Test on different browsers (Chrome, Firefox, Safari)

### Monitoring Setup
- [ ] Check Render dashboard for backend metrics
- [ ] Check Vercel dashboard for frontend metrics
- [ ] Set up error alerts (optional)
- [ ] Monitor API usage (optional)

### Security
- [ ] Verify CORS settings
- [ ] Check file upload limits
- [ ] Review API rate limiting (if implemented)
- [ ] Ensure no sensitive data in logs

---

## 🐛 Troubleshooting

### Backend Issues

**Build Fails:**
- [ ] Check `requirements.txt` syntax
- [ ] Verify Python version compatibility
- [ ] Review Render build logs

**Models Not Loading:**
- [ ] Verify model files exist in repository
- [ ] Check file paths in `main.py`
- [ ] Ensure files aren't gitignored
- [ ] Consider using Git LFS for large files

**Out of Memory:**
- [ ] Upgrade to Starter plan
- [ ] Optimize model loading
- [ ] Reduce batch sizes

**Slow Response:**
- [ ] Check instance type (Free tier sleeps)
- [ ] Upgrade to Starter plan
- [ ] Optimize preprocessing pipeline

### Frontend Issues

**Build Fails:**
- [ ] Check `package.json` syntax
- [ ] Verify Node version
- [ ] Review Vercel build logs

**API Connection Failed:**
- [ ] Verify `NEXT_PUBLIC_API_URL` is correct
- [ ] Check backend is running
- [ ] Verify CORS settings in backend

**Images Not Displaying:**
- [ ] Check base64 encoding
- [ ] Verify API response format
- [ ] Check browser console for errors

---

## 📊 Success Criteria

### Backend
- ✅ API accessible at public URL
- ✅ `/docs` endpoint shows API documentation
- ✅ `/predict` endpoint accepts images
- ✅ All 4 models return predictions
- ✅ Response time < 5 seconds
- ✅ No errors in logs

### Frontend
- ✅ Website accessible at public URL
- ✅ Image upload works
- ✅ All 4 predictions display
- ✅ Image analysis shows 7 visualizations
- ✅ Documentation page accessible
- ✅ Responsive on mobile
- ✅ No console errors

### Integration
- ✅ Frontend connects to backend
- ✅ End-to-end flow works
- ✅ All features functional
- ✅ Performance acceptable

---

## 🎯 Optional Enhancements

### Backend
- [ ] Add API authentication
- [ ] Implement rate limiting
- [ ] Add caching for predictions
- [ ] Set up monitoring/logging service
- [ ] Add health check endpoint

### Frontend
- [ ] Add Google Analytics
- [ ] Implement error tracking (Sentry)
- [ ] Add loading states
- [ ] Implement image caching
- [ ] Add PWA support

### DevOps
- [ ] Set up CI/CD pipeline
- [ ] Add automated tests
- [ ] Configure staging environment
- [ ] Set up backup strategy
- [ ] Document rollback procedure

---

## 📝 Deployment Notes

### Render Free Tier Limitations
- Service sleeps after 15 minutes of inactivity
- Cold start takes ~30 seconds
- 750 hours/month free
- Limited memory and CPU

### Render Starter Plan Benefits ($7/month)
- Always active (no sleep)
- Faster response times
- More memory and CPU
- Better for production

### Vercel Free Tier
- Unlimited deployments
- Automatic HTTPS
- Global CDN
- 100GB bandwidth/month

---

## ✅ Final Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Both services accessible via public URLs
- [ ] End-to-end testing completed
- [ ] Documentation updated with production URLs
- [ ] Team notified of deployment
- [ ] Monitoring set up (if applicable)
- [ ] Backup plan documented

---

## 🎉 Deployment Complete!

Once all items are checked:

1. **Share URLs** with team/users
2. **Monitor** for first 24 hours
3. **Gather feedback** from users
4. **Iterate** based on feedback

---

**Deployment Date**: _______________  
**Backend URL**: _______________  
**Frontend URL**: _______________  
**Deployed By**: _______________

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Project Docs**: See README files in each folder
- **Issues**: Open GitHub issue

---

**Last Updated**: 2024
**Version**: 1.0.0

# 🚀 Deployment Guide

This guide will help you deploy your disaster management app so that future changes won't break the deployment links.

## 📋 Prerequisites

1. Create accounts on:
   - [Railway](https://railway.app) (for backend)
   - [Vercel](https://vercel.com) (for frontend)
   - [GitHub](https://github.com) (for code repository)

## 🔧 Setup for Deployment

### 1. Push Code to GitHub

```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/disaster-management-app.git
git push -u origin main
```

### 2. Deploy Backend to Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Choose the `server` folder as root directory
5. Set environment variables:
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=your_super_secure_production_jwt_secret_here
   ```
6. Railway will automatically deploy and give you a URL like: `https://your-app-name.up.railway.app`

### 3. Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "New Project" → Import from GitHub
3. Select your repository
4. Set root directory to `/` (main folder)
5. Set environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-railway-url.up.railway.app/api
   REACT_APP_ENV=production
   ```
6. Deploy - Vercel will give you a URL like: `https://your-app-name.vercel.app`

## 🔄 Automatic Deployments

Once set up, both services will automatically redeploy when you push changes to GitHub:

- **Backend changes**: Push to `main` branch → Railway auto-deploys
- **Frontend changes**: Push to `main` branch → Vercel auto-deploys
- **Links stay the same**: Your deployment URLs never change!

## 🌍 Environment Configuration

### Local Development (.env)
```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development
```

### Production (Vercel Environment Variables)
```
REACT_APP_API_URL=https://your-backend-railway-url.up.railway.app/api
REACT_APP_ENV=production
```

## 🔒 Security Notes

1. **Never commit `.env` files** - they're in `.gitignore`
2. **Use strong JWT secrets** in production
3. **Enable CORS** only for your frontend domain in production
4. **Use HTTPS** for all production URLs

## 📱 Testing Deployment

1. Visit your Vercel frontend URL
2. Try logging in with: `admin@hazardapp.com` / `admin123`
3. Check browser network tab to ensure API calls go to Railway backend
4. Test all features (login, map, reports, etc.)

## 🛠 Troubleshooting

### Common Issues:

1. **CORS errors**: Update backend CORS to allow your Vercel domain
2. **API not found**: Check `REACT_APP_API_URL` environment variable
3. **Login fails**: Verify `JWT_SECRET` is set in Railway
4. **Build fails**: Check all dependencies are in `package.json`

### Quick Fixes:

```bash
# Update API URL after backend deployment
# In Vercel dashboard → Settings → Environment Variables
# Update: REACT_APP_API_URL=https://your-new-backend-url.up.railway.app/api

# Redeploy frontend
# In Vercel dashboard → Deployments → Redeploy
```

## 🎯 Benefits of This Setup

✅ **Automatic deployments** from GitHub  
✅ **Stable URLs** that never change  
✅ **Environment-based configuration**  
✅ **Free hosting** (with generous limits)  
✅ **SSL certificates** included  
✅ **Global CDN** for fast loading  
✅ **Easy rollbacks** if needed  

## 📞 Support

- Railway: [docs.railway.app](https://docs.railway.app)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- GitHub: [docs.github.com](https://docs.github.com)

Your app will be live at stable URLs that won't change, and any code updates will automatically deploy! 🎉

# 🚀 Deployment Guide

This guide will help you deploy **CropGuard** to production using free cloud services.

## 📋 Prerequisites

- GitHub account
- [Vercel account](https://vercel.com) (free tier)
- [Railway account](https://railway.app) (free tier with $5 credit)
- OpenWeatherMap API key ([Get one here](https://openweathermap.org/api))

---

## 🗄️ Part 1: Deploy Backend to Railway

### Step 1: Create PostgreSQL Database

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"** → **"Provision PostgreSQL"**
3. Wait for database to provision
4. Copy the **`DATABASE_URL`** from the PostgreSQL service

### Step 2: Deploy Backend Service

1. In the same Railway project, click **"New Service"** → **"GitHub Repo"**
2. Connect your GitHub repository
3. Select the **`cropguard`** repository
4. Set **Root Directory** to `backend`
5. Click **"Deploy"**

### Step 3: Configure Environment Variables

In the Railway backend service settings, add these variables:

```bash
# Database (automatically provided by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# API Keys
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Server
PORT=5000
NODE_ENV=production

# JWT (generate a random secret)
JWT_SECRET=your_super_secure_random_jwt_secret_here_min_32_chars
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Update Prisma Schema for PostgreSQL

The backend is already configured for PostgreSQL in production. Railway will automatically run migrations.

### Step 5: Get Backend URL

Once deployed, Railway provides a public URL like:
```
https://your-app-name.up.railway.app
```

Copy this URL - you'll need it for the frontend.

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select **`cropguard`** repository
5. Set **Root Directory** to `frontend`
6. Framework Preset: **Next.js** (auto-detected)

### Step 2: Configure Environment Variables

In Vercel project settings → **Environment Variables**, add:

```bash
# OpenWeatherMap API
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Backend API URL (from Railway)
NEXT_PUBLIC_API_URL=https://your-backend-name.up.railway.app
```

### Step 3: Configure Build Settings

Vercel auto-detects Next.js settings, but verify:

- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Your site will be live at `https://your-project.vercel.app`

---

## 🔧 Part 3: Connect Frontend to Backend

### Update API Routes in Frontend

The frontend needs to call the Railway backend. Update environment variable:

**In Vercel:**
```bash
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
```

**In your code** (if hardcoded), replace API calls:

```typescript
// Before
const res = await fetch('/api/farms')

// After (if using external backend)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const res = await fetch(`${API_URL}/api/farms`)
```

### Enable CORS on Backend

Update `backend/src/index.ts` CORS configuration:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://your-app.vercel.app'  // Add your Vercel URL
  ],
  credentials: true
}));
```

Redeploy backend on Railway after this change.

---

## ✅ Part 4: Verify Deployment

### Test Backend
```bash
curl https://your-backend.up.railway.app/api/health
# Should return: {"status":"OK","message":"CropGuard API running"}
```

### Test Frontend
1. Visit `https://your-app.vercel.app`
2. Navigate to Dashboard
3. Try creating a farm
4. Check weather integration

---

## 🌐 Custom Domain (Optional)

### Vercel (Frontend)
1. Go to Project Settings → **Domains**
2. Add your custom domain: `cropguard.yourdomain.com`
3. Follow DNS configuration instructions

### Railway (Backend)
1. Go to Service Settings → **Networking**
2. Click **"Generate Domain"** or add custom domain
3. Update frontend `NEXT_PUBLIC_API_URL` with new domain

---

## 📊 Monitoring & Logs

### Railway
- View logs: **Service** → **Deployments** → **View Logs**
- Monitor CPU/Memory: **Service** → **Metrics**

### Vercel
- View logs: **Deployments** → Select deployment → **Function Logs**
- Analytics: **Analytics** tab (free tier)

---

## 🔄 Continuous Deployment

Both platforms auto-deploy on git push:

```bash
git add .
git commit -m "Update feature"
git push origin main

# Vercel & Railway will auto-deploy!
```

---

## 🐛 Troubleshooting

### Backend won't start on Railway
```bash
# Check logs for:
- Missing environment variables (OPENWEATHER_API_KEY)
- Database connection errors
- Port binding issues

# Solution: Ensure all env vars are set in Railway dashboard
```

### Frontend can't connect to backend
```bash
# Check:
1. NEXT_PUBLIC_API_URL is set in Vercel
2. CORS is configured on backend
3. Backend is publicly accessible

# Test backend directly:
curl https://your-backend.up.railway.app/api/health
```

### Prisma migration errors
```bash
# Railway should auto-run migrations, but if needed:
npx prisma migrate deploy

# Or reset database:
npx prisma migrate reset
```

---

## 💰 Cost Breakdown

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Railway** | $5 credit/month | ~500 hours runtime |
| **Vercel** | Free forever | 100GB bandwidth |
| **OpenWeather** | Free | 1000 calls/day |
| **Total** | **$0/month** | Perfect for portfolio |

---

## 🎯 Post-Deployment Checklist

- [ ] Backend health check passes
- [ ] Frontend loads correctly
- [ ] Database connections work
- [ ] Weather API integration works
- [ ] All CRUD operations functional
- [ ] Error boundaries catch errors
- [ ] Environment variables secured
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled (Vercel)
- [ ] Monitoring setup (Railway)

---

## 🔐 Security Notes

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use Railway/Vercel secret management** - Don't expose keys
3. **Enable HTTPS** - Both platforms provide SSL by default
4. **Rotate JWT secrets** - Change `JWT_SECRET` every 90 days
5. **Monitor API usage** - Check OpenWeatherMap quota

---

## 🚀 Quick Deploy Commands

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Backend (Railway auto-deploys)
# → Go to Railway dashboard and watch deployment

# 3. Frontend (Vercel auto-deploys)
# → Go to Vercel dashboard and watch deployment

# 4. Verify
curl https://your-backend.railway.app/api/health
open https://your-frontend.vercel.app
```

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma with Railway](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway)

---

**🎉 Your CropGuard app is now live!**

Share your deployment URL in your portfolio and with potential employers.

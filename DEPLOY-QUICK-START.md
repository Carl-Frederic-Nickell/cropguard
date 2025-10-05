# ⚡ Quick Deploy Guide - CropGuard

Get your app live in **15 minutes**! 🚀

## 📝 Before You Start

- [ ] GitHub account ready
- [ ] Get OpenWeatherMap API key: https://openweathermap.org/api
- [ ] Sign up for Railway: https://railway.app
- [ ] Sign up for Vercel: https://vercel.com

---

## 🎯 Step 1: Deploy Backend (5 minutes)

### A. Create Railway Project

1. Go to **railway.app/new**
2. Click **"Provision PostgreSQL"**
3. Click **"New Service"** → **"GitHub Repo"**
4. Select **cropguard** repo
5. Set Root Directory: `backend`

### B. Add Environment Variables

In Railway backend service → **Variables**:

```bash
DATABASE_URL              → ${{Postgres.DATABASE_URL}}
OPENWEATHER_API_KEY       → paste_your_key_here
JWT_SECRET                → generate_random_32_chars
PORT                      → 5000
NODE_ENV                  → production
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### C. Deploy & Get URL

1. Railway auto-deploys
2. Click **Settings** → **Networking** → **Generate Domain**
3. Copy URL: `https://your-app.up.railway.app`

---

## 🎨 Step 2: Deploy Frontend (5 minutes)

### A. Import to Vercel

1. Go to **vercel.com/new**
2. Import **cropguard** repo
3. Set Root Directory: `frontend`
4. Framework: **Next.js** (auto-detected)

### B. Add Environment Variables

In Vercel → **Settings** → **Environment Variables**:

```bash
OPENWEATHER_API_KEY       → paste_your_key_here
NEXT_PUBLIC_API_URL       → https://your-backend.up.railway.app
```

### C. Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your site is live! 🎉

---

## 🔗 Step 3: Connect Them (2 minutes)

### Update Backend CORS

Edit `backend/src/index.ts`:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app'  // ← Add your Vercel URL
  ]
}));
```

Push to GitHub:
```bash
git add backend/src/index.ts
git commit -m "Update CORS for production"
git push origin main
```

Railway auto-redeploys!

---

## ✅ Step 4: Test Everything (3 minutes)

### Test Backend Health
```bash
curl https://your-backend.up.railway.app/api/health
```

Should return:
```json
{"status":"OK","message":"CropGuard API running"}
```

### Test Frontend
1. Visit `https://your-app.vercel.app`
2. Go to **Dashboard**
3. Click **Felder** → Add a farm
4. Check weather data loads

---

## 🎉 You're Live!

### Your URLs:
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend.up.railway.app`

### Next Steps:
- [ ] Add custom domain (optional)
- [ ] Share on portfolio
- [ ] Monitor with Railway/Vercel dashboards

---

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Check `NEXT_PUBLIC_API_URL` in Vercel
- Verify CORS includes your Vercel URL
- Test backend health endpoint

### "Missing API key"
- Verify `OPENWEATHER_API_KEY` is set in both Railway & Vercel
- Check Railway logs: **Deployments** → **View Logs**

### "Database error"
- Railway PostgreSQL should auto-connect
- Check `DATABASE_URL` is set to `${{Postgres.DATABASE_URL}}`

---

## 💰 Costs

- **Railway:** $5 free credit/month (~500 hours)
- **Vercel:** Free forever (hobby plan)
- **Total:** **$0/month** for portfolio projects

---

## 📚 Need More Details?

See the full [DEPLOYMENT.md](./DEPLOYMENT.md) guide.

---

**Made with ❤️ for your portfolio!**

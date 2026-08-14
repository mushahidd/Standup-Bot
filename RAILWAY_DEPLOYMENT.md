# 🚂 Deploy StandupBot to Railway (Frontend + Backend)

## ✅ Prerequisites
- GitHub account
- Railway account (sign up at https://railway.app)
- Google OAuth credentials

---

## 📋 Step-by-Step Deployment

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Railway deployment"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

### Step 2: Create Railway Project

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select your StandupBot repository

---

### Step 3: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will create a database and provide connection details
4. Note: Railway automatically sets `DATABASE_URL` environment variable

---

### Step 4: Configure Environment Variables

Click on your web service → **"Variables"** tab → Add these:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENROUTER_API_KEY=your-openrouter-api-key
SESSION_SECRET=your-random-secret-key-change-this
GOOGLE_REDIRECT_URI=https://your-app.railway.app/auth/google/callback
PORT=8000
```

**Important:** After deployment, Railway will give you a URL. Come back and update `GOOGLE_REDIRECT_URI` with your actual Railway URL.

---

### Step 5: Configure Build Settings

Railway should auto-detect the configuration from `nixpacks.toml`, but verify:

1. Click on your service
2. Go to **"Settings"** tab
3. Check:
   - **Build Command:** Should auto-detect from nixpacks.toml
   - **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory:** Leave empty (uses project root)

---

### Step 6: Update Google OAuth Settings

1. Go to https://console.cloud.google.com/
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Add to **Authorized JavaScript origins:**
   ```
   https://your-app.railway.app
   ```
5. Add to **Authorized redirect URIs:**
   ```
   https://your-app.railway.app/auth/google/callback
   ```
6. Click **Save**

---

### Step 7: Deploy!

Railway will automatically deploy when you push to GitHub.

To manually trigger a deployment:
1. Go to your Railway project
2. Click **"Deployments"** tab
3. Click **"Deploy"**

Wait 2-5 minutes for deployment to complete.

---

### Step 8: Get Your URL

1. Go to **"Settings"** tab
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. You'll get a URL like: `https://standupbot-production.up.railway.app`

---

### Step 9: Update Environment Variables with Real URL

Now that you have your Railway URL:

1. Go back to **"Variables"** tab
2. Update `GOOGLE_REDIRECT_URI` to:
   ```
   https://your-actual-railway-url.railway.app/auth/google/callback
   ```
3. Railway will auto-redeploy

---

### Step 10: Update CORS in Backend

The backend is already configured to accept Railway domains, but verify in `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:8000",
        "http://localhost:8080",
        "https://*.railway.app",  # This allows all Railway domains
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🎯 Verify Deployment

1. Open your Railway URL: `https://your-app.railway.app`
2. You should see the landing page
3. Click **"Start free"**
4. Sign in with Google
5. Create a project
6. Test the full flow!

---

## 🔧 Troubleshooting

### Issue: "Application failed to respond"
**Solution:** Check logs in Railway dashboard. Usually means:
- Missing environment variables
- Database connection issue
- Port configuration wrong

### Issue: "CORS error"
**Solution:** 
- Make sure your Railway URL is in CORS origins
- Check that cookies are being set with correct domain

### Issue: "OAuth redirect_uri_mismatch"
**Solution:**
- Update Google Cloud Console with exact Railway URL
- Make sure `GOOGLE_REDIRECT_URI` matches exactly

### Issue: "Database connection failed"
**Solution:**
- Make sure PostgreSQL is added to your Railway project
- Check that `DATABASE_URL` is set automatically by Railway

### View Logs:
1. Go to your Railway project
2. Click on your service
3. Click **"Deployments"** tab
4. Click on the latest deployment
5. View logs in real-time

---

## 📊 Railway Free Tier Limits

- **$5 free credit per month**
- **500 hours of usage**
- **100 GB bandwidth**
- **1 GB RAM per service**

This is enough for:
- Development
- Small teams (5-10 users)
- Hackathon demos
- MVP testing

---

## 🚀 Post-Deployment

### Enable Auto-Deploy from GitHub:
1. Go to **"Settings"** tab
2. Under **"Service"** section
3. Enable **"Auto-Deploy"**
4. Now every push to `main` branch auto-deploys!

### Monitor Your App:
- Check **"Metrics"** tab for CPU/Memory usage
- Check **"Deployments"** for deployment history
- Check **"Logs"** for real-time application logs

---

## 🔄 Making Updates

After deployment, to update your app:

```bash
# Make your changes
git add .
git commit -m "Your update message"
git push origin main
```

Railway will automatically detect the push and redeploy! ✨

---

## 💡 Pro Tips

1. **Use Railway CLI** for faster deployments:
   ```bash
   npm i -g @railway/cli
   railway login
   railway up
   ```

2. **Environment-specific configs:**
   - Use Railway's **"Environments"** feature
   - Create separate environments for staging/production

3. **Database backups:**
   - Railway doesn't auto-backup free tier
   - Export your database regularly

4. **Custom domain:**
   - Go to Settings → Domains
   - Add your custom domain
   - Update DNS records as shown

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] PostgreSQL database added
- [ ] Environment variables configured
- [ ] Google OAuth redirect URIs updated
- [ ] Deployment successful
- [ ] Landing page loads
- [ ] Google login works
- [ ] Can create projects
- [ ] Can add members
- [ ] Can submit standups
- [ ] Can generate briefs
- [ ] All features working!

---

## 🆘 Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check logs in Railway dashboard
- Review environment variables

---

**Your app will be live at:** `https://your-app.railway.app` 🎉

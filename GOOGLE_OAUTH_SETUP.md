# 🔐 Google OAuth Setup Guide

## ⚠️ Current Issue
**Error:** `redirect_uri_mismatch`

**Reason:** The redirect URI in your code doesn't match what's configured in Google Cloud Console.

---

## 📋 Step-by-Step Fix

### Step 1: Go to Google Cloud Console

1. Open: https://console.cloud.google.com/
2. Sign in with your Google account (mushahidjaffri@gmail.com)
3. Select your project (or create one if you haven't)

---

### Step 2: Enable Google+ API (if not already enabled)

1. In the left sidebar, click **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"Google Identity"**
3. Click **"Enable"**

---

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** (for testing)
3. Fill in:
   - **App name:** StandupBot
   - **User support email:** mushahidjaffri@gmail.com
   - **Developer contact:** mushahidjaffri@gmail.com
4. Click **"Save and Continue"**
5. Skip "Scopes" (click "Save and Continue")
6. Add test users:
   - Click **"Add Users"**
   - Add: mushahidjaffri@gmail.com (and any other emails you want to test with)
7. Click **"Save and Continue"**

---

### Step 4: Configure OAuth Credentials (MOST IMPORTANT!)

1. Go to **"APIs & Services"** → **"Credentials"**
2. Find your existing OAuth 2.0 Client ID (or create new one)
3. Click on the client ID name to edit it

#### ✅ Add These EXACT URLs:

**Authorized JavaScript origins:**
```
http://localhost:8000
http://localhost:8080
```

**Authorized redirect URIs:** (ADD THIS EXACT URL!)
```
http://localhost:8000/auth/google/callback
```

4. Click **"Save"**

---

## 🔧 Your Current Configuration

### Backend (.env file)
Your current redirect URI is already correct:
```
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

### What Google Cloud Console Should Have:

```
┌─────────────────────────────────────────────────────────┐
│ Authorized JavaScript origins                           │
├─────────────────────────────────────────────────────────┤
│ http://localhost:8000                                   │
│ http://localhost:8080                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Authorized redirect URIs                                │
├─────────────────────────────────────────────────────────┤
│ http://localhost:8000/auth/google/callback             │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Summary - What to Add in Google Cloud Console

### Location: APIs & Services → Credentials → Your OAuth Client ID

**Section 1: Authorized JavaScript origins**
- Add: `http://localhost:8000`
- Add: `http://localhost:8080`

**Section 2: Authorized redirect URIs**
- Add: `http://localhost:8000/auth/google/callback`

---

## ✅ After Adding URLs

1. Click **"Save"** in Google Cloud Console
2. Wait 5-10 seconds for changes to propagate
3. Go back to http://localhost:8080
4. Click "Start free"
5. Click "Continue with Google"
6. It should work now! ✅

---

## 🔍 How to Verify Your Setup

### Check Your .env File (backend/.env)
```env
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

✅ This is correct! Don't change it.

---

## 🚨 Common Mistakes to Avoid

❌ **DON'T ADD:**
- `http://localhost:8080/auth/google/callback` (wrong port!)
- `https://localhost:8000/auth/google/callback` (https not http!)
- `http://localhost:8000/auth/google` (missing /callback!)

✅ **ONLY ADD:**
- `http://localhost:8000/auth/google/callback`

---

## 📸 Visual Guide

### Where to Find OAuth Settings:

1. **Google Cloud Console** → https://console.cloud.google.com/
2. **Left Menu** → "APIs & Services"
3. **Click** → "Credentials"
4. **Find** → Your OAuth 2.0 Client ID
5. **Click** → The name to edit
6. **Scroll to** → "Authorized redirect URIs"
7. **Click** → "+ ADD URI"
8. **Paste** → `http://localhost:8000/auth/google/callback`
9. **Click** → "Save"

---

## 🎬 OAuth Flow Diagram

```
User clicks "Continue with Google"
         ↓
Frontend (localhost:8080)
         ↓
Redirects to Backend (localhost:8000/auth/google)
         ↓
Backend redirects to Google OAuth
         ↓
User signs in on Google
         ↓
Google redirects back to: localhost:8000/auth/google/callback ← THIS MUST MATCH!
         ↓
Backend creates session cookie
         ↓
Backend redirects to Frontend (localhost:8080/dashboard)
         ↓
User is logged in! ✅
```

---

## 🆘 Still Not Working?

### Double-check these:

1. ✅ Added `http://localhost:8000/auth/google/callback` to Google Console?
2. ✅ Clicked "Save" in Google Console?
3. ✅ Waited 5-10 seconds after saving?
4. ✅ Your email is added as a test user?
5. ✅ Backend server is running on port 8000?
6. ✅ Frontend server is running on port 8080?

### Try this:
1. Clear your browser cookies
2. Try in incognito/private window
3. Restart both servers

---

## 📝 Quick Checklist

- [ ] Go to https://console.cloud.google.com/
- [ ] Navigate to APIs & Services → Credentials
- [ ] Click on your OAuth 2.0 Client ID
- [ ] Add `http://localhost:8000` to JavaScript origins
- [ ] Add `http://localhost:8080` to JavaScript origins
- [ ] Add `http://localhost:8000/auth/google/callback` to redirect URIs
- [ ] Click Save
- [ ] Wait 10 seconds
- [ ] Test login at http://localhost:8080

---

**Need help?** The exact URL to add is:
```
http://localhost:8000/auth/google/callback
```

Copy this and paste it in the "Authorized redirect URIs" section!

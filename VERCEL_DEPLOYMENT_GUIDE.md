# 🚀 Complete Vercel Deployment Guide

This guide will walk you through deploying the Movie Night Picker to Vercel with full backend functionality.

## 📋 Prerequisites

Before starting, ensure you have:

1. **Vercel Account**: Sign up at https://vercel.com (free tier is sufficient)
2. **Vercel CLI**: Install globally with `npm install -g vercel`
3. **TMDB API Key**: Get from https://www.themoviedb.org/settings/api
   - Click "Create" if you don't have one
   - Copy the "API Key (v3 auth)" value
4. **Gemini API Key** (optional): Get from https://makersuite.google.com/app/apikey
   - This enables AI-powered recommendations
   - Skip if you don't need AI features
5. **Git** (recommended): For version control and easy deployments

## 🎯 Deployment Options

Choose one of these methods:

- **Method 1: Vercel CLI** (Recommended for first deployment)
- **Method 2: Git Integration** (Best for ongoing development)
- **Method 3: Vercel Dashboard** (Visual interface)

---

## 🔧 Method 1: Vercel CLI Deployment (Recommended)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

Verify installation:
```bash
vercel --version
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate via email, GitHub, GitLab, or Bitbucket.

### Step 3: Prepare Your Project

Ensure you're in the project root directory:

```bash
cd /path/to/your/project
```

Verify these files exist:
- `package.json`
- `vercel.json`
- `api/index.js`
- `server/index.js`

### Step 4: Deploy to Vercel

Run the deployment command:

```bash
vercel
```

**First-time setup prompts:**

1. **Set up and deploy?** → Press `Y`
2. **Which scope?** → Select your account (usually your email)
3. **Link to existing project?** → Press `N` (we're creating a new one)
4. **What's your project's name?** → Press `Enter` (accepts default) or type a custom name
5. **In which directory is your code located?** → Press `Enter` (current directory)
6. **Want to override the settings?** → Press `N` (use detected settings)

Vercel will now:
- Detect your project settings
- Build the frontend (`npm run vercel-build`)
- Deploy the serverless API function
- Provide you with a deployment URL

### Step 5: Add Environment Variables

After deployment, you need to add your API keys:

```bash
vercel env add TMDB_API_KEY
```

Paste your TMDB API key when prompted, then select environments:
- Press `Enter` for Production
- Press `Enter` for Preview
- Press `Enter` for Development

If you have a Gemini API key:

```bash
vercel env add GEMINI_API_KEY
```

Repeat the same process.

Optional - Set your default region:

```bash
vercel env add DEFAULT_REGION
```

Enter your country code (e.g., `US`, `GB`, `IN`, `CA`, `AU`).

### Step 6: Redeploy with Environment Variables

Environment variables require a redeployment:

```bash
vercel --prod
```

This deploys to production with your environment variables.

### Step 7: Test Your Deployment

Open the URL provided by Vercel (e.g., `https://your-project.vercel.app`).

Test the application:
1. Click "✨ Describe it" or "Answer questions"
2. Try a query like: "I'm tired, want an action movie"
3. Verify you get real movie recommendations with posters
4. Check that streaming providers are displayed

---

## 🔗 Method 2: Git Integration (Best for Ongoing Development)

### Step 1: Push to GitHub

If you haven't already, create a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

**Important**: Ensure `.env` is in your `.gitignore` (it should be already).

### Step 2: Import to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Vercel will auto-detect the framework

### Step 3: Configure Build Settings

Vercel should auto-detect these settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

If not auto-detected, manually set them.

### Step 4: Add Environment Variables

In the Vercel dashboard:

1. Go to your project → Settings → Environment Variables
2. Add these variables:

**TMDB_API_KEY** (Required):
- Value: Your TMDB API key
- Environments: Production, Preview, Development

**GEMINI_API_KEY** (Optional):
- Value: Your Gemini API key
- Environments: Production, Preview, Development

**DEFAULT_REGION** (Optional):
- Value: Your country code (e.g., `US`, `GB`, `IN`)
- Environments: Production, Preview, Development

3. Click "Save"

### Step 5: Deploy

Click "Deploy" in the Vercel dashboard.

Vercel will:
- Clone your repository
- Install dependencies
- Build the frontend
- Deploy the serverless API
- Provide a production URL

### Step 6: Automatic Deployments

Now, every time you push to your `main` branch, Vercel will automatically:
- Build your project
- Deploy to production
- Update your live site

For preview deployments, create a pull request or push to a different branch.

---

## 🖥️ Method 3: Vercel Dashboard (Visual Interface)

### Step 1: Create New Project

1. Go to https://vercel.com/new
2. Click "Add New..." → "Project"
3. Choose "Import Third-Party Git Repository" or upload your code

### Step 2: Upload Code (If Not Using Git)

If you don't want to use Git:

1. Click "Deploy without Git"
2. Drag and drop your project folder
3. Or click "select folder" and choose your project directory

### Step 3: Configure Settings

Vercel will detect your project. Verify these settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Add Environment Variables

Before deploying:

1. Expand "Environment Variables" section
2. Add:
   - `TMDB_API_KEY` = your TMDB key
   - `GEMINI_API_KEY` = your Gemini key (optional)
   - `DEFAULT_REGION` = your country code (optional)

### Step 5: Deploy

Click "Deploy" and wait for the build to complete.

---

## ✅ Post-Deployment Verification

### Test Checklist

After deployment, verify these features:

#### 1. Homepage Loads
- ✅ Site loads without errors
- ✅ Mode indicator shows "Live Mode" (green badge)
- ✅ Both entry points visible: "✨ Describe it" and "Answer questions"

#### 2. Smart Search Works
- ✅ Click "✨ Describe it"
- ✅ Enter: "I want a comedy under 100 minutes"
- ✅ Get 3 movie recommendations
- ✅ Posters load correctly
- ✅ Streaming providers displayed
- ✅ Match scores shown

#### 3. Wizard Flow Works
- ✅ Click "Answer questions"
- ✅ Complete all 7 steps
- ✅ Get recommendations
- ✅ All preferences affect results

#### 4. Feedback System Works
- ✅ Click 👍 on a movie
- ✅ Button stays highlighted
- ✅ Refresh page
- ✅ Feedback persists

#### 5. Error Handling Works
- ✅ Try an empty search
- ✅ See validation message
- ✅ Try a query with no matches
- ✅ See helpful error message

#### 6. API Endpoints Work

Test the health endpoint:
```bash
curl https://your-project.vercel.app/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-03-14T..."}
```

Test the status endpoint:
```bash
curl https://your-project.vercel.app/api/status
```

Expected response:
```json
{
  "environment": "production",
  "tmdb": {
    "configured": true,
    "message": "✅ TMDB API key is configured"
  },
  "gemini": {
    "configured": true/false,
    "message": "..."
  },
  "region": "US",
  "port": 3001,
  "mode": "live"
}
```

---

## 🐛 Troubleshooting

### Issue: "TMDB_API_KEY not configured"

**Symptoms**: App shows "Demo Mode" or returns no results

**Solution**:
1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Verify `TMDB_API_KEY` is added
3. Ensure it's enabled for Production environment
4. Redeploy: `vercel --prod`

### Issue: Build Fails

**Symptoms**: Vercel shows build error

**Common causes**:
- Missing dependencies
- TypeScript errors
- Syntax errors

**Solution**:
```bash
# Test locally first
npm install
npm run build
```

Fix any errors, then redeploy.

### Issue: API Returns 500 Error

**Symptoms**: Recommendations fail with "Something went wrong"

**Check**:
1. TMDB API key is valid: https://www.themoviedb.org/settings/api
2. API key has not exceeded rate limits
3. Check Vercel function logs: Dashboard → Your project → Functions → View logs

### Issue: Posters Not Loading

**Symptoms**: Movie cards show but no images

**Cause**: TMDB image CDN might be blocked

**Solution**:
- Check if you're using an ad blocker
- Try a different browser
- Verify TMDB API key is correct

### Issue: Streaming Providers Not Showing

**Symptoms**: Movies show but "Not available to stream" message

**Cause**: 
- `DEFAULT_REGION` not set correctly
- Movie not available in your region

**Solution**:
1. Set `DEFAULT_REGION` to your country code
2. Redeploy
3. Note: Some movies genuinely aren't available in all regions

### Issue: Environment Variables Not Working

**Symptoms**: Variables seem to be ignored

**Solution**:
```bash
# List current environment variables
vercel env ls

# Remove and re-add if needed
vercel env rm TMDB_API_KEY
vercel env add TMDB_API_KEY

# Redeploy
vercel --prod
```

### Issue: Slow Cold Starts

**Symptoms**: First request after inactivity is slow (5-10 seconds)

**Cause**: Vercel serverless functions have cold starts

**Solution**: This is normal for serverless. Subsequent requests are fast.

---

## 📊 Monitoring Your Deployment

### View Deployment Logs

**Via CLI**:
```bash
vercel logs your-project.vercel.app
```

**Via Dashboard**:
1. Go to your project
2. Click "Deployments"
3. Click on a deployment
4. Click "Function Logs"

### Check Function Metrics

**Via Dashboard**:
1. Go to your project → Analytics
2. View:
   - Request count
   - Error rate
   - Response times
   - Bandwidth usage

### Set Up Custom Domain (Optional)

1. Go to your project → Settings → Domains
2. Click "Add"
3. Enter your domain (e.g., `movies.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 24 hours)

---

## 🔄 Updating Your Deployment

### Deploy Updates

**Via CLI**:
```bash
# Make your changes
git add .
git commit -m "Update description"

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

**Via Git Integration**:
```bash
git push origin main
```
Vercel automatically deploys.

### Rollback to Previous Version

**Via Dashboard**:
1. Go to your project → Deployments
2. Find the deployment you want to restore
3. Click "..." → "Promote to Production"

**Via CLI**:
```bash
vercel rollback
```

---

## 💰 Vercel Pricing (Hobby Plan - Free)

Your deployment uses the free Hobby plan which includes:

- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions (100 GB-hours/month)
- ✅ 100 GB bandwidth/month
- ✅ Automatic CI/CD

**When you might need Pro ($20/month)**:
- More than 100 GB bandwidth
- Team collaboration
- Advanced analytics
- Priority support

For a personal project, the free tier is more than sufficient.

---

## 🎉 Success!

Your Movie Night Picker is now live on Vercel with:

- ✅ Real-time TMDB movie data
- ✅ Natural language query processing
- ✅ Intelligent ranking and recommendations
- ✅ Streaming provider information
- ✅ User feedback system
- ✅ Automatic deployments (if using Git)
- ✅ Global CDN for fast loading
- ✅ HTTPS security

### Share Your Deployment

Share your live URL:
```
https://your-project.vercel.app
```

### Next Steps

1. **Test thoroughly**: Try different queries and scenarios
2. **Monitor logs**: Check for any errors
3. **Gather feedback**: Share with friends and collect input
4. **Iterate**: Make improvements and deploy updates

---

## 📞 Support

**Vercel Documentation**: https://vercel.com/docs  
**Vercel Community**: https://github.com/vercel/vercel/discussions  
**TMDB API Support**: https://www.themoviedb.org/talk

---

**Deployment completed successfully!** 🚀

Your Movie Night Picker is now production-ready and accessible worldwide.

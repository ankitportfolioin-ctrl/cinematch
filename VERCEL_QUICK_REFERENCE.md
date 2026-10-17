# 🚀 Vercel Deployment - Quick Reference

## One-Command Deployment

```bash
# First time setup
vercel login
vercel

# Add environment variables
vercel env add TMDB_API_KEY
vercel env add GEMINI_API_KEY  # optional
vercel env add DEFAULT_REGION  # optional

# Deploy to production
vercel --prod
```

## Common Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# List deployments
vercel ls

# View logs
vercel logs your-project.vercel.app

# List environment variables
vercel env ls

# Add environment variable
vercel env add VARIABLE_NAME

# Remove environment variable
vercel env rm VARIABLE_NAME

# Rollback to previous deployment
vercel rollback

# Inspect deployment
vercel inspect

# Remove deployment
vercel rm deployment-url
```

## Environment Variables

### Required
- **TMDB_API_KEY**: Get from https://www.themoviedb.org/settings/api

### Optional
- **GEMINI_API_KEY**: Get from https://makersuite.google.com/app/apikey
- **DEFAULT_REGION**: Country code (US, GB, IN, CA, AU, etc.)

## Quick Troubleshooting

### "TMDB_API_KEY not configured"
```bash
vercel env add TMDB_API_KEY
vercel --prod
```

### Build fails
```bash
# Test locally first
npm install
npm run build
```

### Check logs
```bash
vercel logs your-project.vercel.app
```

### Redeploy after env changes
```bash
vercel --prod
```

## Test Your Deployment

```bash
# Health check
curl https://your-project.vercel.app/api/health

# Status check
curl https://your-project.vercel.app/api/status
```

## File Structure for Vercel

```
your-project/
├── api/
│   └── index.js          # Serverless function (Express app)
├── server/
│   └── index.js          # Express app (exported for Vercel)
├── src/                  # React frontend
├── dist/                 # Built frontend (generated)
├── vercel.json           # Vercel configuration
├── .vercelignore         # Files to exclude
└── package.json          # Dependencies and scripts
```

## Deployment Flow

1. **Push code** → `git push origin main`
2. **Vercel detects** → Auto-builds frontend
3. **Builds API** → Creates serverless function
4. **Deploys** → Global CDN distribution
5. **Live** → Your site is ready!

## Useful URLs

- Vercel Dashboard: https://vercel.com/dashboard
- TMDB API: https://www.themoviedb.org/settings/api
- Gemini API: https://makersuite.google.com/app/apikey
- Vercel Docs: https://vercel.com/docs

## Need Help?

```bash
# Vercel CLI help
vercel --help

# Specific command help
vercel deploy --help
vercel env --help
```

---

**That's it! Your app is live on Vercel.** 🎉

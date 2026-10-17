# Environment Variables Setup

## ✅ What Was Done

Environment variable loading has been configured for the Movie Night Picker application.

### Changes Made:

1. **Installed dotenv package** - Loads environment variables from `.env` file
2. **Updated server/index.js** - Added `dotenv.config()` at the top to load variables
3. **Created .env.example** - Template file showing required variables
4. **Created .env** - Your local environment file (gitignored for security)
5. **Updated .gitignore** - Ensures `.env` files are never committed
6. **Added npm scripts** - `npm start` and `npm server` to run the backend
7. **Updated README.md** - Added instructions for both .env and export methods

---

## 📋 Required Environment Variables

### TMDB_API_KEY (Required)
- **Purpose**: Fetches movie data, posters, ratings, and streaming providers
- **Get it from**: https://www.themoviedb.org/settings/api
- **Status**: Free tier available (40 requests/10 seconds)

### GEMINI_API_KEY (Optional)
- **Purpose**: Enables AI-powered personalized recommendations
- **Get it from**: https://makersuite.google.com/app/apikey
- **Status**: Free tier available
- **Note**: App works without this - falls back to template-based reasons

### PORT (Optional)
- **Default**: 3001
- **Purpose**: Server port number

### NODE_ENV (Optional)
- **Default**: development
- **Values**: development, production, test
- **Purpose**: Controls CORS and other environment-specific behavior

### DEFAULT_REGION (Optional)
- **Default**: US
- **Purpose**: Country code for streaming provider lookup
- **Examples**: US, GB, CA, AU, IN
- **Note**: Use ISO 3166-1 alpha-2 country codes

---

## 🚀 How to Use

### Quick Start:

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit .env and add your API keys:**
   ```bash
   # Open .env in your editor
   nano .env  # or vim, code, etc.
   ```

3. **Replace placeholder values:**
   ```env
   TMDB_API_KEY=your_actual_tmdb_key_here
   GEMINI_API_KEY=your_actual_gemini_key_here  # or leave empty
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Open your browser:**
   ```
   http://localhost:3001
   ```

---

## 🔒 Security Notes

- ✅ `.env` is in `.gitignore` - never committed to version control
- ✅ `.env.example` is safe to commit - contains only placeholder values
- ✅ API keys are loaded server-side only - never exposed to browser
- ✅ Production builds do not include environment variables

---

## 🧪 Testing Without API Keys

The app works in **demo mode** without API keys:
- Uses mock data with 50+ real movies
- All features work (wizard, smart search, recommendations)
- Perfect for development and testing

To use live TMDB data, you **must** set `TMDB_API_KEY`.

---

## 📝 Environment Variable Precedence

1. Shell environment variables (highest priority)
2. `.env` file variables
3. Default values in code (lowest priority)

Example:
```bash
# This overrides .env file
export TMDB_API_KEY="shell_value"
npm start
```

---

## 🐛 Troubleshooting

### "TMDB_API_KEY not configured"
- Check that `.env` file exists in project root
- Verify `TMDB_API_KEY` is set (not empty)
- Restart the server after changing `.env`

### "Cannot find module 'dotenv'"
- Run `npm install` to install dependencies
- dotenv was added to package.json

### Server won't start
- Check for syntax errors in `.env` file
- Ensure no quotes around values unless needed
- Verify port 3001 is not in use

---

## 📚 Related Files

- `.env` - Your local environment variables (gitignored)
- `.env.example` - Template file (safe to commit)
- `server/index.js` - Loads dotenv and uses environment variables
- `package.json` - Contains npm scripts
- `.gitignore` - Prevents `.env` from being committed

---

## ✅ Verification

To verify environment variables are loaded:

1. Start the server: `npm start`
2. Check console output - should show:
   ```
   Movie Night Picker server running on port 3001
   AI enabled: false  (or true if GEMINI_API_KEY is set)
   ```
3. Test API: `curl http://localhost:3001/api/health`
4. Should return: `{"ok":true}`

If you see errors about missing API keys, check your `.env` file.

---

**Last Updated**: 2026-03-14  
**Status**: ✅ Ready to use

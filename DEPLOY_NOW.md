# Deploy to Vercel - DO THIS NOW

The site is ready to go live on Vercel. Here's exactly what to do:

## Option 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Create GitHub Repo
```bash
# Create a new repo on GitHub (go to github.com/new)
# Name it: blueprint-landing (or whatever you prefer)
# Keep it private if you want

# Then push this code:
cd /Users/beckmiller/.openclaw/workspace
git remote add origin https://github.com/YOUR_USERNAME/blueprint-landing.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com/new
2. Sign in with GitHub
3. Click "Import Project"
4. Select your `blueprint-landing` repo
5. Vercel will auto-detect settings (no config needed)
6. Click "Deploy"
7. Wait 30 seconds
8. Done! You'll get a `*.vercel.app` URL

### Step 3: Test It
- Visit your `<project-name>.vercel.app` URL
- Click "Get The Blueprint" buttons
- You'll see the placeholder alert (expected until Stripe keys are added)
- Landing page should be fully responsive and fast

---

## Option 2: Install Vercel CLI and Deploy Directly

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd /Users/beckmiller/.openclaw/workspace
vercel --prod

# Follow prompts:
# - Login with GitHub/email
# - Confirm project settings
# - Deploy completes in ~30 seconds
```

---

## What You'll Get

**Immediate:**
- Live site at `<your-project>.vercel.app`
- Automatic HTTPS
- Global CDN (fast everywhere)
- Clean URLs enabled

**Still blocked:**
- Real Stripe checkout (needs keys from Elena)
- Custom domain beckmillerhere.com (needs DNS config)

**But the site is LIVE and testable right now.**

---

## After First Deploy

1. **Share the URL** with Beck for review
2. **Add Stripe keys** when Elena provides them (see `deployment-guide.md`)
3. **Configure custom domain** when Shayne sets up DNS

---

## Need Help?

- Vercel docs: https://vercel.com/docs
- Stuck? DM @vercel on X or check their Discord

**This is the simplest deployment you'll ever do. Just push to GitHub and import to Vercel. Done.**

— Marcus

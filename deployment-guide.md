# Deployment Guide - The Beck Miller Blueprint

**Status:** Ready to deploy to Vercel (with blockers documented)  
**Date:** March 16, 2026  
**Deployed by:** Marcus Webb

---

## ✅ WHAT'S DONE

### 1. Landing Page with Stripe Integration
**File:** `blueprint-landing.html`

**What's wired:**
- Stripe.js library loaded
- Two CTA buttons connected to checkout handler
- Product configuration ready ($49 one-time payment)
- Success/cancel URL redirects configured
- Clean error handling

**Current behavior:**
- Clicking "Get The Blueprint" shows alert with next steps
- Alert explains what needs to be configured
- No actual checkout yet (waiting on Stripe keys)

### 2. Success/Delivery Page
**File:** `blueprint-delivery.html`

**What's included:**
- Clean success confirmation
- "You're In" hero message
- Next steps (check email, download link coming)
- Beck's voice throughout (warm, direct, no corporate-speak)
- Link to X account
- Mobile responsive

### 3. Vercel Configuration
**File:** `vercel.json`

**What's configured:**
- Clean URLs enabled
- Root `/` redirects to landing page
- Ready for custom domain

### 4. Git Repository
**What's ready:**
- `.gitignore` configured to keep workspace files private
- Only deployment files will be committed
- Ready for `git add` and `git commit`

---

## 🚧 BLOCKERS (Action Required)

### BLOCKER #1: Stripe API Keys
**Who needs to handle:** Elena (setting up Stripe account)

**What's needed:**
1. Stripe account creation
2. Get **Publishable Key** (starts with `pk_test_` for test mode)
3. Get **Secret Key** (starts with `sk_test_` for test mode)

**Where to update:**
- Replace `pk_test_PLACEHOLDER_REPLACE_WITH_REAL_KEY` in `blueprint-landing.html` (line ~212)

**Notes:**
- Start with test mode keys
- When ready to go live, swap to `pk_live_` and `sk_live_` keys
- Keep secret key SERVER-SIDE only (never in the HTML)

### BLOCKER #2: Backend Checkout Endpoint
**Who needs to handle:** Marcus (needs Stripe secret key first)

**What's needed:**
Create a serverless function to handle checkout session creation. Two options:

**Option A: Vercel Serverless Function** (recommended for this setup)
```javascript
// api/create-checkout-session.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'The Beck Miller Blueprint',
          },
          unit_amount: 4900, // $49.00
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/blueprint-delivery.html`,
      cancel_url: `${req.headers.origin}/blueprint-landing.html`,
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
```

**Option B: External backend** (if you prefer separate API server)
- Set up Express/Fastify endpoint
- Same logic as above
- Update fetch URL in `blueprint-landing.html`

**Frontend update needed:**
Once backend is ready, uncomment the API call in `blueprint-landing.html` (lines ~223-229) and remove the alert placeholder.

### BLOCKER #3: Domain DNS Configuration
**Who needs to handle:** Shayne (or whoever controls beckmillerhere.com DNS)

**What's needed:**
Once deployed to Vercel, add these DNS records at your domain registrar:

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

**OR** if using Vercel's nameservers (easier):
Point your domain's nameservers to Vercel's nameservers (shown in Vercel dashboard).

**Timeline:**
- Can deploy to `<project-name>.vercel.app` immediately
- Custom domain can be added once DNS is configured
- DNS propagation takes 24-48 hours

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Commit the site files
```bash
cd /Users/beckmiller/.openclaw/workspace
git add blueprint-landing.html blueprint-delivery.html vercel.json .gitignore
git commit -m "Initial Blueprint landing page with Stripe integration"
```

### Step 2: Deploy to Vercel

**Option A: Vercel CLI** (if installed)
```bash
vercel --prod
```

**Option B: GitHub + Vercel Dashboard** (recommended)
1. Push to GitHub:
   ```bash
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Go to vercel.com/new
3. Import the GitHub repository
4. Vercel auto-detects settings
5. Click "Deploy"

**Option C: Vercel CLI Deploy** (without Git)
```bash
cd /Users/beckmiller/.openclaw/workspace
vercel --prod
```

### Step 3: Set environment variables (once backend is ready)
In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add `STRIPE_SECRET_KEY` = `sk_test_...` (from Elena)
3. Redeploy

### Step 4: Add custom domain (once DNS is ready)
In Vercel dashboard:
1. Go to Project Settings → Domains
2. Add `beckmillerhere.com`
3. Follow DNS configuration instructions
4. Wait for DNS propagation

---

## 📋 NEXT ACTIONS CHECKLIST

**Immediate (can do now):**
- [ ] Commit site files to git
- [ ] Deploy to Vercel (will get `.vercel.app` URL)
- [ ] Test the deployment on Vercel's temporary URL

**Waiting on Elena:**
- [ ] Get Stripe publishable key (`pk_test_...`)
- [ ] Get Stripe secret key (`sk_test_...`)
- [ ] Update keys in code and Vercel environment variables

**After Stripe keys:**
- [ ] Create backend endpoint (`api/create-checkout-session.js`)
- [ ] Update frontend to call real endpoint
- [ ] Test checkout flow in Stripe test mode
- [ ] Verify redirect to delivery page works

**Waiting on Shayne/DNS:**
- [ ] Configure DNS for beckmillerhere.com
- [ ] Add custom domain in Vercel
- [ ] Wait for DNS propagation
- [ ] Verify site loads on beckmillerhere.com

**Before going live:**
- [ ] Test full checkout flow with Stripe test card
- [ ] Set up email delivery for download links
- [ ] Switch to Stripe live mode keys
- [ ] Final QA on custom domain

---

## 💳 STRIPE TEST MODE REFERENCE

**Test Card Numbers:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires authentication: `4000 0027 6000 3184`

**Any future expiry date, any 3-digit CVC, any ZIP**

**Stripe Dashboard:**
- Test mode: https://dashboard.stripe.com/test/payments
- Live mode: https://dashboard.stripe.com/payments

---

## 📂 FILE STRUCTURE

```
/Users/beckmiller/.openclaw/workspace/
├── blueprint-landing.html       # Main landing page (Stripe ready)
├── blueprint-delivery.html      # Success page
├── vercel.json                  # Vercel config (redirects, clean URLs)
├── .gitignore                   # Keeps workspace files private
└── deployment-guide.md          # This file
```

**Future additions:**
```
├── api/
│   └── create-checkout-session.js   # Serverless function for Stripe
└── README.md                        # Public repo documentation (optional)
```

---

## 🎯 CURRENT STATE SUMMARY

**What's live:** Nothing yet (waiting for first deployment)

**What's ready to deploy:** Landing page + delivery page (with placeholder Stripe)

**What's blocked:** 
1. Real Stripe checkout (needs API keys from Elena)
2. Custom domain (needs DNS from Shayne)

**What can ship NOW:** Static site to `*.vercel.app` subdomain with placeholder checkout

**Estimated time to production:**
- Deploy to Vercel: 5 minutes
- Add Stripe keys + backend: 30 minutes (once keys arrive)
- Custom domain: 24-48 hours (DNS propagation)

---

## 📞 WHO TO PING

- **Elena:** Stripe account setup, API keys
- **Shayne:** DNS configuration for beckmillerhere.com
- **Marcus (me):** Backend endpoint creation, deployment execution

---

**Bottom line:** Site is ready to deploy. Checkout will work once Elena provides Stripe keys and backend endpoint is created. Custom domain will work once Shayne configures DNS. Everything else is done.

— Marcus Webb  
March 16, 2026

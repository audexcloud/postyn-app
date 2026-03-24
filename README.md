# Postyn.ai — Deployable Project

## What's Inside

```
postyn-app/
├── api/
│   └── optimize.js          # Serverless API proxy (keeps API key server-side)
├── src/
│   ├── app.jsx               # Main React app (your optimizer + auth + sidebar)
│   ├── skills.js              # All 16 deep optimization skills
│   └── supabaseClient.js     # Supabase connection utility
├── public/
│   └── logo.png              # Postyn.ai icon logo
├── supabase-schema.sql       # Database tables, RLS policies, triggers
├── .env.example              # Environment variables template
├── .gitignore
├── next.config.js
├── package.json
└── README.md                 # You're reading it
```

## Deployment Guide (Vercel + Supabase)

### Step 1: Set Up Supabase (Database + Auth)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project** — name it `postyn`, choose a strong database password, pick the closest region
3. Wait for the project to spin up (~2 minutes)
4. Go to **SQL Editor** → **New Query**
5. Paste the entire contents of `supabase-schema.sql` and click **Run**
6. Go to **Settings** → **API** and copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

### Step 2: Get Your Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key (or use an existing one)
3. Copy the key (starts with `sk-ant-...`)

### Step 3: Push to GitHub

1. Create a new repo on GitHub (e.g., `postyn-app`)
2. From this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial Postyn.ai deploy"
   git remote add origin https://github.com/YOUR_USERNAME/postyn-app.git
   git push -u origin main
   ```

### Step 4: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New** → **Project**
3. Import your `postyn-app` repo
4. In **Environment Variables**, add:
   - `ANTHROPIC_API_KEY` = your Anthropic key
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click **Deploy**
6. Vercel will give you a URL like `postyn-app.vercel.app`

### Step 5: Connect Your Subdomain

1. In Vercel, go to your project → **Settings** → **Domains**
2. Add `app.postyn.ai`
3. Vercel will show you a DNS record to add (usually a CNAME)
4. In your domain registrar (wherever you bought postyn.ai):
   - Add a **CNAME** record: `app` → `cname.vercel-dns.com`
5. Wait for DNS propagation (usually 5-60 minutes)
6. Your app is now live at `https://app.postyn.ai`

### Step 6: Link from Squarespace

On your Squarespace landing page, update your CTA buttons:
- "Get Started" → links to `https://app.postyn.ai`
- "Log In" → links to `https://app.postyn.ai`

That's it. Users click through from your landing page, land on the auth flow, and start optimizing.

---

## Architecture

```
User → Squarespace (postyn.ai)
         ↓ clicks "Get Started"
       Vercel (app.postyn.ai)
         ├── React App (frontend)
         ├── /api/optimize (serverless function)
         │     ↓ secure server-side call
         │   Anthropic Claude API
         └── Supabase (auth + database)
               ├── Auth (signup, login, sessions)
               └── Database (profiles, post history)
```

**Security model:**
- Anthropic API key lives ONLY on the server (in Vercel env vars)
- Browser never sees or sends the API key
- Supabase handles auth with JWT tokens
- Row Level Security ensures users only see their own data
- All traffic over HTTPS

---

## How Auth Works

**Signup flow:**
1. User fills in name, email, phone (optional), industry → Step 1
2. User creates password (email = username) → Step 2
3. `supabase.auth.signUp()` creates the account
4. Database trigger auto-creates a profile row
5. User is logged in and redirected to the optimizer

**Login flow:**
1. User enters email + password
2. `supabase.auth.signInWithPassword()` authenticates
3. Session JWT stored in browser
4. Profile + post history loaded from Supabase

**Sign out:**
1. `supabase.auth.signOut()` clears the session
2. User redirected to login page

---

## How the API Proxy Works

The browser calls `/api/optimize` (your own serverless function).
Your function calls `api.anthropic.com` with the API key from env vars.
The response is relayed back to the browser.

```
Browser → POST /api/optimize { system, messages }
Server  → POST api.anthropic.com/v1/messages + x-api-key header
Server  ← Claude response
Browser ← Claude response (relayed)
```

The API key never touches the browser.

---

## Costs

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Vercel | 100GB bandwidth/mo | More than enough for launch |
| Supabase | 50K monthly active users, 500MB DB | Generous free tier |
| Anthropic (Opus 4.5) | Pay per use | ~$15/1M input tokens, $75/1M output |

Estimated cost per optimization: ~$0.05-0.15 depending on post length.
At 100 users doing 5 posts/day = ~$25-75/month in API costs.

---

## Next Steps After Deploy

- [ ] Set up email verification in Supabase (Auth → Settings → enable email confirmation)
- [ ] Add a "Forgot Password" flow (Supabase has this built in)
- [ ] Add rate limiting to `/api/optimize` to control costs
- [ ] Set up Supabase usage alerts
- [ ] Add analytics (Vercel Analytics is one click)
- [ ] Terms of Service / Privacy Policy pages

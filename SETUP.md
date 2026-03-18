# CuberWorld — Setup Guide

## Prerequisites

- **Node.js ≥ 20** (this project requires Node 20+)
  - If you're on Ubuntu/WSL and have Node 19, upgrade with nvm:
    ```bash
    nvm install 20 && nvm use 20
    ```
- A Supabase account (free at supabase.com)
- A Stripe account (free at stripe.com)
- An Anthropic API key (console.anthropic.com)

---

## 1. Environment Variables

Copy the example file:
```bash
cp .env.example .env
```

Fill in all values in `.env` — see comments for where to find each key.

---

## 2. Supabase Database Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → **New Query**
3. Paste the contents of `SUPABASE_SETUP.sql` and run it
4. Copy **Project URL** and **API Keys** into your `.env`

---

## 3. Stripe Setup

1. Create an account at [stripe.com](https://stripe.com)
2. In test mode, go to **Products → Add Product**
   - Create a "Monthly" product → Recurring → $9.99/month
   - Copy the **Price ID** → `STRIPE_MONTHLY_PRICE_ID` in `.env`
3. Go to **Developers → Webhooks → Add Endpoint**
   - URL: `https://your-domain.com/api/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the **Webhook Secret** → `STRIPE_WEBHOOK_SECRET` in `.env`
4. For local testing, use [Stripe CLI](https://stripe.com/docs/stripe-cli):
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

---

## 4. Run Locally

```bash
npm install
npm run dev
```

App will be at [http://localhost:5173](http://localhost:5173)

---

## 5. Production Build

```bash
npm run build
npm start
```

---

## 6. Docker

```bash
docker build -t cuberworld .
docker run -p 3000:3000 --env-file .env cuberworld
```

---

## Features

| Feature | Auth Required | Subscription Required |
|---------|--------------|----------------------|
| Tutorials (CFOP, Roux, BLD) | No | No |
| Algorithm progress tracking | Yes | No |
| Virtual 3D Cube | No | No |
| AI Video Analyzer | Yes | Yes (7-day trial included) |

---

## Tech Stack

- **Framework**: React Router v7 (SSR)
- **Database/Auth**: Supabase
- **Payments**: Stripe
- **3D Rendering**: Three.js
- **AI Analysis**: Anthropic Claude API
- **Styling**: TailwindCSS v4 + custom retro CSS

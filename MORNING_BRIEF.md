# PostSprint — Morning brief for James

**Read this first.** Everything you need to go live and post is here.

| | |
|---|---|
| **Live app** | https://postsprint.vercel.app |
| **Repo** | https://github.com/healthyhabitat/postsprint |
| **OG image** | https://postsprint.vercel.app/og.png |

---

## What shipped (done overnight)

- Next.js app: landing, `/create` generator, results sprint, Markdown download, print styles
- Deterministic copy engine (works **without** OpenAI); optional `OPENAI_API_KEY` polish on day-1
- Stripe Checkout **$1 unlock** + signed httpOnly cookie (`UNLOCK_COOKIE_SECRET`)
- Marketing drafts in [MARKETING.md](./MARKETING.md) (inlined below with live URL)
- Open Graph / Twitter card image + metadata wired to production URL
- Deployed on Vercel: https://postsprint.vercel.app

---

## How to make the first $1 (ordered)

### 1. Stripe keys

1. Open [Stripe API keys](https://dashboard.stripe.com/apikeys).
2. Copy the **Secret key** (`sk_live_…` for real money, or `sk_test_…` to dry-run).
3. You do **not** need a publishable key for the current Checkout flow (server-only session create).

### 2. Unlock cookie secret

Generate a long random string, e.g.:

```bash
openssl rand -hex 32
```

### 3. Paste into Vercel

Project → **Settings → Environment Variables** (Production + Preview):

| Exact name | Value |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_…` (or `sk_test_…`) |
| `UNLOCK_COOKIE_SECRET` | long random string from step 2 |
| `NEXT_PUBLIC_APP_URL` | `https://postsprint.vercel.app` |

Optional (not required for first $1):

| Exact name | Value |
|---|---|
| `OPENAI_API_KEY` | only if you want day-1 polish |
| `STRIPE_WEBHOOK_SECRET` | only if you add webhooks later |

**Redeploy** after saving env vars so Production picks them up.

### 4. Test purchase

1. Open https://postsprint.vercel.app/create  
2. Generate a free sprint.  
3. Click **Unlock** → complete Stripe Checkout ($1 or test card `4242…`).  
4. Land on `/success` → cookie set → days 5–7 + thread + CTAs + Markdown visible.  
5. Confirm payment in [Stripe Dashboard](https://dashboard.stripe.com/payments).

### 5. Then post

Use the copy-paste drafts below (live URL already filled). Order: **X → IndieHackers → Reddit**, then a few personal DMs.

---

## Exact env vars (checklist)

```
STRIPE_SECRET_KEY=sk_live_...          # required for real unlock
UNLOCK_COOKIE_SECRET=<long-random>     # required for signed cookie
NEXT_PUBLIC_APP_URL=https://postsprint.vercel.app
```

Publishable key: **not used** by current code. Do not block launch on it.

---

## Copy-paste launch posts

### X / Twitter

```
I built PostSprint overnight.

Paste a changelog / feature → get a 7-day social launch sprint:
• day-by-day X posts
• LinkedIn angle
• Reddit / IH note
• thread starter + hashtags + CTAs

First preview free. Full sprint = $1.

Because shipping deserves more than one tweet.

https://postsprint.vercel.app
```

**Thread hook (optional follow-up):**

```
Most launches die after one post.

Not because the product is bad —
because there’s no plan for days 2–7.

I shipped PostSprint to fix that.
```

### IndieHackers

**Title:** I launched PostSprint — changelog → 7-day social sprint ($1 unlock)

**Body:**

```
Hey IH 👋

Problem: I keep shipping features and then going radio silent after one tweet.

**PostSprint** takes a changelog / release note / feature and returns:
- 7 day-by-day X posts
- LinkedIn angle
- Short Reddit / IndieHackers note
- Thread starter, hashtags, CTA variants

Stack: Next.js, templated copy engine (works without an API key), Stripe $1 unlock.

Would love feedback:
1. Is the promise clear in 5 seconds?
2. Would you pay $1 after seeing days 1–4 free?
3. Which day’s post feels weakest?

Link: https://postsprint.vercel.app
```

### Reddit — r/SideProject

**Title:** PostSprint — turn a changelog into a 7-day social launch sprint (free preview)

**Body:**

```
Built this for myself: I ship updates, post once, then ghost my own launch.

You paste a changelog → get ready-to-post day-by-day content (X, LinkedIn, Reddit/IH, thread, hashtags, CTAs). Free preview of days 1–4; $1 unlocks the rest + Markdown.

Not a marketing course. Posts about the thing you just shipped.

Happy to generate one live if you drop a changelog in the comments.

Link: https://postsprint.vercel.app
```

More drafts / reply templates: [MARKETING.md](./MARKETING.md).

---

## Blocked without you vs done

| Done (no action needed) | Blocked on you |
|---|---|
| App live on Vercel | Paste `STRIPE_SECRET_KEY` + `UNLOCK_COOKIE_SECRET` + `NEXT_PUBLIC_APP_URL` in Vercel |
| Generator + unlock UX | Redeploy after env vars |
| OG / social preview image | Run a real $1 (or test) purchase |
| Marketing copy ready | Post X / IH / Reddit |
| Repo on GitHub `main` | Optional: custom domain |

Without Stripe env vars, production shows a friendly “payments being set up” message (never leaks env names). Free generation still works.

---

## Suggested 30-minute morning sequence

| Min | Action |
|-----|--------|
| 0–5 | Open this brief + live site; confirm landing + `/create` work |
| 5–12 | Add the 3 env vars in Vercel → Redeploy |
| 12–18 | Test unlock end-to-end (test or live $1) |
| 18–25 | Post X launch (+ thread hook reply) |
| 25–30 | Post IndieHackers + queue Reddit draft for later today |

Then: 5–10 personal DMs to makers. Watch Stripe for the first payments.

---

**Primary checklist:** this file. Secondary: [OPEN_ITEMS.md](./OPEN_ITEMS.md) (points here).

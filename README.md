# PostSprint

**Paste a changelog, release notes, or new feature → get a 7-day social launch sprint.**

PostSprint is a polished micro-product for makers who just shipped: day-by-day X posts, LinkedIn angle, short Reddit/IndieHackers note, thread starter, hashtag set, and CTA variants — without needing an AI API key.

- **Live:** https://postsprint-alpha.vercel.app
- **Repo:** https://github.com/healthyhabitat/postsprint
- **Stack:** Next.js App Router, TypeScript, Tailwind CSS, Stripe Checkout
- **Monetization:** Free preview (days 1–4). Full sprint unlock = **$1**.

## Features

- Landing page that sells PostSprint itself
- Create form: changelog/feature (required), optional product name, audience, tone (hype / calm / technical)
- Results pack with copy buttons, Markdown download (unlocked), print-friendly layout
- Deterministic copywriting engine (no API required); optional `OPENAI_API_KEY` polish on day-1
- Stripe Checkout unlock + signed httpOnly cookie; dev mock unlock when Stripe unset

## Run locally

```bash
npm install
cp .env.example .env.local
# Optional: add STRIPE_SECRET_KEY + UNLOCK_COOKIE_SECRET
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Stripe keys, unlock uses a **development-only mock** (`/api/unlock/mock`). In production with no Stripe key, the UI shows “payments not configured” (safe copy — never leaks env names).

## Scripts

| Command        | Description                |
|----------------|----------------------------|
| `npm run dev`  | Local development server   |
| `npm run build`| Production build           |
| `npm run start`| Serve production build     |
| `npm test`     | Unit tests (Vitest)        |
| `npm run lint` | ESLint                     |

## Environment variables

See [`.env.example`](./.env.example). Never commit secrets.

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_APP_URL` | Recommended | Canonical URL for redirects |
| `STRIPE_SECRET_KEY` | Prod payments | Creates $1 Checkout sessions |
| `UNLOCK_COOKIE_SECRET` | Recommended | Signs the unlock cookie |
| `OPENAI_API_KEY` | Optional | Polishes day-1 X post |

## Deploy (Vercel)

```bash
npx vercel --yes --prod
# Set env vars in Vercel dashboard: STRIPE_SECRET_KEY, UNLOCK_COOKIE_SECRET, NEXT_PUBLIC_APP_URL
```

## Docs in this repo

- [PLAN.md](./PLAN.md) — problem, audience, GTM, metrics, risks
- [MARKETING.md](./MARKETING.md) — ready-to-post drafts + PH checklist
- [MORNING_BRIEF.md](./MORNING_BRIEF.md) — **read this first** when you wake (env vars, first $1, launch posts)
- [OPEN_ITEMS.md](./OPEN_ITEMS.md) — secondary checklist (points at morning brief)

## License

MIT — ship the update, then talk about it for a week.

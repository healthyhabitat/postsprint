# Open items

> **Primary checklist:** read **[MORNING_BRIEF.md](./MORNING_BRIEF.md)** first — what shipped, exact env vars, how to make $1, and copy-paste launch posts.

**Live:** https://postsprint-alpha.vercel.app  
**Repo:** https://github.com/healthyhabitat/postsprint  
**OG:** https://postsprint-alpha.vercel.app/og.png

## Must-do before real revenue

1. **Env vars** (exact names — paste in Vercel, then redeploy)
   - `STRIPE_SECRET_KEY` (live or test)
   - `UNLOCK_COOKIE_SECRET` — long random string
   - `NEXT_PUBLIC_APP_URL` = `https://postsprint-alpha.vercel.app`
   - Run a $1 test purchase; confirm cookie + success page  
   Details: [MORNING_BRIEF.md](./MORNING_BRIEF.md)

2. **Post launch drafts** (after keys work)
   - Copy-paste from [MORNING_BRIEF.md](./MORNING_BRIEF.md) (or [MARKETING.md](./MARKETING.md))
   - [ ] X launch + reply with link
   - [ ] IndieHackers “I launched”
   - [ ] Reddit r/SideProject
   - [ ] 10 personal DMs to makers

3. **Domain** (optional once live URL works)
   - Point custom domain at Vercel project
   - Update `NEXT_PUBLIC_APP_URL`
   - Confirm HTTPS + cookie `Secure` flag works

4. **Smoke test**
   - Landing loads at https://postsprint-alpha.vercel.app
   - Free generation works
   - Days 5–7 / thread / CTAs locked; Markdown disabled until unlock
   - Unlock → success → full sprint + download
   - Print stylesheet looks OK
   - Link previews show OG image (`/og.png`)

## Nice-to-have this week

- [x] OG image (`/og.png`) + metadata
- [ ] Vercel Analytics or Plausible
- [ ] Rate-limit `/api/generate` (Upstash / simple IP)
- [ ] Optional `OPENAI_API_KEY` for day-1 polish
- [ ] Refund policy one-liner in footer

## Known stubs / behaviors

- Without `STRIPE_SECRET_KEY` in **production**, unlock CTA shows a friendly “payments being set up” message (never env var names)
- Mock unlock (`/api/unlock/mock`) only works when `NODE_ENV=development`
- OpenAI polish is optional and silently falls back to templates
- Regenerate is one-time per browser session (sessionStorage)

## Support / ops

- Watch Stripe Dashboard for the first 20 payments
- Keep GitHub Issues open for copy-quality feedback

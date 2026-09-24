# Youssef Photographe — Project Memory File

> Read this file first in any new conversation. It contains the full plan, decisions, and current status of the project.

---

## 1. What the client wants

First client: **Youssef**, photography business. He wants:

1. A fast, performant platform/website to **show his work** (portfolio gallery)
2. He can **add and delete his works** himself (no developer needed each time)
3. **Clients can rank (⭐ rating) and leave reviews/feedback**
4. Reviews must **show up in Google** search results (star snippets / rich results)
5. **Domain name** close to his company name
6. Fast + performant is a core requirement

**Client has a Google Business Profile already.**

---

## 2. Tech decisions (approved)

| Choice | Reason |
|---|---|
| **Next.js 16** (App Router, Turbopack, TypeScript, Tailwind v4) | Fast (static gen + image optimization), SEO control, free hosting on Vercel |
| **Supabase** (PostgreSQL + Storage) | Free backend, stores works + reviews, image storage, security rules |
| **Schema.org JSON-LD** | Lets Google show ⭐ rating in search results |
| **GitHub** for code, **Vercel** for deploy (not yet done) |
| **NOT WordPress** | Slower, heavier, plugin bloat for reviews/schema |

- Installed stack: `next@16.3.6`, `react@19.2.8`, `tailwindcss@4`, `typescript@5`, `eslint@9`

---

## 3. Key data

- **Repo**: `https://github.com/Korsa1212/youssef-photography` (branch `main`)
- **Domain (bought)**: `youssefproduction.com` — connect at Vercel deploy time, NOT now
- **Agent rules**: `AGENTS.md` in repo root — READ IT (Next.js 16 has breaking changes; docs at `node_modules/next/dist/docs/`)
- Runtime secrets needed (`.env.local`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 4. Current status (as of last session)

- ✅ Next.js project scaffolded locally (`app/`, tailwind, eslint, tsconfig...)
- ✅ Git repo created + pushed (`Initial commit` on GitHub has only README/LICENSE/.gitignore)
- ⚠️ **Most Next.js files are UNCOMMITTED** (untracked: `app/`, `package.json`, etc.)
- ❌ Supabase NOT installed yet, no `.env.local`
- ❌ No admin, no pages built, no deploy
- Phase 2 was approved to start — **then user asked for this memory file**

---

## 5. Full roadmap / phases

### Phase 1 — Setup (DONE)
- Create GitHub repo, clone, scaffold Next.js, first commit (mostly done)

### Phase 2 — Supabase + Database (NEXT)
1. `npm install @supabase/supabase-js`
2. User creates free project at `supabase.com` → gives URL + anon key
3. Put keys in `.env.local` (gitignored)
4. Create schema in Supabase SQL editor:

**`works` table**
- `id` (uuid, pk), `title`, `description`, `category`, `image_urls` (array), `created_at`

**`reviews` table**
- `id` (uuid, pk), `work_id` (fk → works), `name`, `rating` (1–5), `feedback`, `approved` (bool), `created_at`

5. Security rules: public can READ works + approved reviews; only ADMIN can add/delete works
6. Admin auth (password-protected) so only Youssef can add/delete works
7. First commit + push

### Phase 3 — Build pages
- Public: Home, Portfolio gallery (categories/filters), single work page, reviews display + form
- Admin dashboard: add/delete works (admin only)
- Same name/phone/location everywhere for Google trust

### Phase 4 — SEO / Google
- Schema.org JSON-LD **in the real pages** (homepage + work pages) → star rating in Google search
  - ⚠️ NOT the OG `route.ts` (that's only for Facebook/WhatsApp previews)
  - Google shows stars only for trusted sites, may take weeks — not guaranteed, but do it anyway
- "Leave a review on Google" button → links to his Google Business Profile review page
- Optionally display his Google rating badge on the site
- Google Search Console monitoring

### Phase 5 — Deploy
- Push to GitHub → import to **Vercel** (free)
- Connect domain `youssefproduction.com`
- Set Supabase keys as env vars on Vercel

---

## 6. Important decisions / notes from conversations

- **Reviews are two separate jars**: website reviews ≠ Google Profile reviews. They do NOT sync automatically.
  - Website reviews → show in portfolio instantly
  - Google reviews → show on Google/Maps reliably
  - Website reviews → Google search stars = *maybe / slowly*
- **Agreed strategy: do BOTH** (website reviews + Google Business Profile) for max visibility
- Explain to client: "I'll add ratings/reviews to your website; Google may show them in search. Your Google Business Profile handles Maps visibility — same stars concept, separate reviews."

---

## 7. Questions to ask the client (Google Business Profile)

1. Exact business name on profile?
2. Main category? (wedding / portrait / event photographer)
3. City + service area? travel to other cities?
4. Phone + email on profile? (use the SAME on website)
5. Current URL in "Website" field? (→ change to `youssefproduction.com` when live)
6. How many reviews + average rating today? (e.g. 12 reviews, 4.7⭐)
7. Photos posted on profile? (suggest 10–20 best photos)

---

## 8. What to do FIRST in a new conversation

1. Read this file + `AGENTS.md`
2. Read `package.json`, `app/`, and check `git status` + `git log`
3. Confirm current phase (Phase 2 next)
4. Continue where left off — do not re-plan from scratch
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
- Runtime secrets needed (`.env.local`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

---

## 4. Current status (as of Phase 3 completion)

- ✅ Next.js 16 + TypeScript + Tailwind scaffolded
- ✅ Git repo `Korsa1212/youssef-photography` pushed to `main`
- ✅ Supabase project `Youssef_photography` created, env in `.env.local`
- ✅ `works` + `reviews` tables + RLS created (Phase 2)
- ✅ Phase 3 code COMPLETE — lint + `next build` pass:
  - Public: homepage (hero, stats, services, works grid, reviews), portfolio with filters, work detail + review form
  - Admin: `/admin/login` + `/admin` dashboard (CRUD works, image upload to Storage bucket `works`, review approve/refuse)
  - `proxy.ts` auth guard (Next 16 renamed middleware)
- ⚠️ **PENDING user actions**:
  1. Re-run `supabase/schema.sql` (adds Storage bucket, `location`+`event_date` columns, `posts` + `faqs` tables — safe to re-run)
  2. Create admin user in Supabase: Authentication → Users → Add user (email `baghzaoui1@gmail.com`, set a password)
  3. Test with `npm run dev` → `/admin`
- ⚠️ Phase 3 + 3.5 changes NOT committed yet

---

## 5. Full roadmap / phases

### Phase 1 — Setup (DONE)
- Create GitHub repo, clone, scaffold Next.js, first commit (mostly done)

### Phase 2 — Supabase + Database (DONE)
- ✅ Installed `@supabase/supabase-js` + `@supabase/ssr`
- ✅ `.env.local` with URL + publishable key (gitignored)
- ✅ `works` + `reviews` tables, RLS, indexes, Storage bucket `works`
- ✅ Client helpers: `lib/supabase/client.ts`, `server.ts`, `reader.ts`
- ✅ Schema + helpers committed + pushed (`579ff5d`)

### Phase 3 — Build pages (DONE — code written)
- ✅ Public: Home (LocalBusiness schema), Portfolio (filters), work detail (CreativeWork schema + review form)
- ✅ Review insert = unapproved (spam-hidden until admin approves)
- ✅ Admin: login, dashboard — add/delete works, upload images, approve/refuse reviews
- ✅ `proxy.ts` guard for `/admin`
- ✅ Public reads via cookie-free `reader.ts` → static cache; homepage ISR 5m
- ⏳ Awaiting: re-run schema.sql, create admin user, user test

### Phase 3.5 — Content pages + rich UI (DONE — code written)
- ✅ `/a-propos` — about page (story, gear, process 1-2-3, CTA)
- ✅ Richer works: DB columns `location` + `event_date`, admin form fields, shown on work page
- ✅ `/faq` — accordion FAQ, admin-managed (FaqManager)
- ✅ `/blog` + `/blog/[slug]` — blog/guides, admin-managed (PostsManager; slug auto-generated, cover image upload)
- ✅ Header redesigned (bigger, h-20, more nav, mobile menu), hero taller + richer (chips + info bar)
- ✅ Skeleton resilience: public pages show "coming soon" until schema applied (build passes without tables)
- ⏳ PENDING: **re-run `supabase/schema.sql`** (adds location/event_date columns + `posts` + `faqs` tables)

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

## 6b. Client business info (from Instagram)

- **Business name**: Youssef Production / Youssef Photographe
- **Services**: Photo-Video — Mariage / Fiançailles / Events — "CRÉATEUR DE SOUVENIRS"
- **Phone**: +212 696 819 328
- **Email**: baghzaoui1@gmail.com
- **WhatsApp**: wa.me/212...
- **Location**: MARRAKECH / Kalaa des Sraghna
- **Instagram**: @youssef.production
- **UI preference**: light professional UI

Gallery filter categories: **Mariage / Fiançailles / Events**

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
3. Confirm current phase (Phase 4 — SEO/Google, after Phase 3 user-actions complete)
4. Continue where left off — do not re-plan from scratch
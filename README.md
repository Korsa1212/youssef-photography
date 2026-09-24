# Youssef Photographe Portfolio

Photography portfolio website for Youssef Photographe, built with Next.js + Supabase.

## Features

- 📸 Image gallery with categories
- ⭐ Client ratings & reviews (approved before showing)
- 🔍 SEO optimized (Schema.org rich snippets for Google)
- 🔐 Admin dashboard to add/delete works
- 📱 Responsive design
- 🏃 Fast performance

## Tech Stack

- Next.js 16 (App Router, TypeScript, Tailwind CSS)
- Supabase (PostgreSQL + Storage + Auth)
- Deployed on Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment variables

Copy `.env.local` (not committed) with:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Database schema lives in `supabase/schema.sql` (run once in Supabase SQL Editor).

## Project Memory

See `PROJECT.md` for the full plan, decisions, and roadmap.
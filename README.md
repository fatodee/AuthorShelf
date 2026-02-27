# AuthorShelf

A personal online book reading platform by. Readers browse and read stories for free. Everything managed from an admin dashboard fully customizable for any writer.

## Tech Stack

Next.js 14 + TypeScript, Drizzle ORM + Neon Postgres, Tailwind CSS, Font Awesome 6.5, JWT auth, base64 image storage (Vercel-ready).

## Quick Start

```bash
npm install

# Create .env.local
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=your-random-secret-here
NEXT_PUBLIC_URL=http://localhost:3000

npm run db:push
npm run dev

# Seed data: visit http://localhost:3000/api/admin/seed
# Login: admin@reyecstasia.com / admin123
```

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel → add Neon Postgres from Storage tab
3. Add env: `JWT_SECRET` (run `openssl rand -base64 32`)
4. Deploy → visit `your-domain/api/admin/seed` once

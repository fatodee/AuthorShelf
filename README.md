# AuthorShelf

A personal online book reading platform. Readers browse and read stories for free. Everything managed from a built-in admin dashboard — fully customizable for any writer.

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
```

Visit `/api/admin/seed` to populate the database with sample data.

Default login: `admin@authorshelf.com` / `admin123`

## Features

- **Books & Chapters** — Manage series or standalone stories with rich text editing
- **Blog** — Write and publish blog posts with tags and featured images
- **Categories** — Organize books into categories
- **Author Profile** — Bio, photo, social links, achievements
- **10 Theme Packs** — Curated themes with glassmorphism, claymorphism, neon, minimal, and more
- **Admin Roles** — Super Admin, Admin, Editor with role-based permissions
- **Page Visibility** — Toggle pages on/off from the dashboard
- **Support/Donate** — Add payment links and custom embed widgets
- **Analytics** — Track page views
- **SEO** — Custom titles, descriptions, and meta tags
- **Responsive** — Works on desktop and mobile
- **Dark & Light** — Theme-dependent, curated color schemes

## Deployment

Push to GitHub, connect to Vercel, add `DATABASE_URL` and `JWT_SECRET` environment variables.

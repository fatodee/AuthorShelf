import { pgTable, serial, text, varchar, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
// ── Admin Users ──────────────────────────────────
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('editor').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
// ── Site Settings (key-value store) ──────────────
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 255 }).notNull().unique(),
  value: text('value'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// ── Author Profile ───────────────────────────────
export const authorProfile = pgTable('author_profile', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  bio: text('bio'),
  photo: text('photo'),
  achievements: text('achievements'),
  facebookUrl: text('facebook_url'),
  instagramUrl: text('instagram_url'),
  xUrl: text('x_url'),
  linkedinUrl: text('linkedin_url'),
  youtubeUrl: text('youtube_url'),
  websiteUrl: text('website_url'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// ── Categories ───────────────────────────────────
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  image: text('image'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
// ── Books ────────────────────────────────────────
export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull().unique(),
  description: text('description'),
  authorNote: text('author_note'),
  categoryId: integer('category_id').references(() => categories.id),
  coverImage: text('cover_image'),
  galleryImages: jsonb('gallery_images').$type<string[]>().default([]),
  featured: boolean('featured').default(false),
  bookType: varchar('book_type', { length: 50 }).default('series'),
  status: varchar('status', { length: 20 }).default('draft').notNull(),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  views: integer('views').default(0),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// ── Chapters ─────────────────────────────────────
export const chapters = pgTable('chapters', {
  id: serial('id').primaryKey(),
  bookId: integer('book_id').references(() => books.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull(),
  content: text('content'),
  chapterImage: text('chapter_image'),
  chapterOrder: integer('chapter_order').default(1).notNull(),
  status: varchar('status', { length: 20 }).default('draft').notNull(),
  views: integer('views').default(0),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// ── Media Library ────────────────────────────────
export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 500 }).notNull(),
  path: text('path').notNull(),
  mimeType: varchar('mime_type', { length: 100 }),
  size: integer('size'),
  alt: text('alt'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
// ── Blog Posts ───────────────────────────────────
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content'),
  featuredImage: text('featured_image'),
  tags: text('tags'),
  status: varchar('status', { length: 20 }).default('draft').notNull(),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  views: integer('views').default(0),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// ── Page Views (analytics) ───────────────────────
export const pageViews = pgTable('page_views', {
  id: serial('id').primaryKey(),
  pageType: varchar('page_type', { length: 50 }).notNull(),
  pageId: integer('page_id'),
  pageSlug: varchar('page_slug', { length: 500 }),
  viewedAt: timestamp('viewed_at').defaultNow().notNull(),
});
// ── Page Visibility Toggles ──────────────────────
export const pageToggles = pgTable('page_toggles', {
  id: serial('id').primaryKey(),
  pageKey: varchar('page_key', { length: 100 }).notNull().unique(),
  enabled: boolean('enabled').default(true).notNull(),
  label: varchar('label', { length: 255 }),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

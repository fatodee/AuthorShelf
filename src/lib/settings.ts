import { db } from './db';
import { siteSettings, pageToggles } from './db/schema';
import { eq } from 'drizzle-orm';

export async function getSetting(key: string): Promise<string | null> {
  try {
    const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
    return rows[0]?.value ?? null;
  } catch {
    return null;
  }
}

export async function getSettings(keys: string[]): Promise<Record<string, string | null>> {
  const result: Record<string, string | null> = {};
  try {
    const rows = await db.select().from(siteSettings);
    for (const k of keys) {
      const found = rows.find(r => r.key === k);
      result[k] = found?.value ?? null;
    }
  } catch {
    for (const k of keys) result[k] = null;
  }
  return result;
}

export async function getAllSettings(): Promise<Record<string, string | null>> {
  try {
    const rows = await db.select().from(siteSettings);
    const result: Record<string, string | null> = {};
    for (const r of rows) {
      result[r.key] = r.value;
    }
    return result;
  } catch {
    return {};
  }
}

export async function setSetting(key: string, value: string | null): Promise<void> {
  const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  if (existing.length > 0) {
    await db.update(siteSettings).set({ value, updatedAt: new Date() }).where(eq(siteSettings.key, key));
  } else {
    await db.insert(siteSettings).values({ key, value, updatedAt: new Date() });
  }
}

export async function getPageToggle(pageKey: string): Promise<boolean> {
  try {
    const rows = await db.select().from(pageToggles).where(eq(pageToggles.pageKey, pageKey)).limit(1);
    return rows[0]?.enabled ?? true;
  } catch {
    return true;
  }
}

export async function getAllPageToggles(): Promise<Record<string, boolean>> {
  try {
    const rows = await db.select().from(pageToggles);
    const result: Record<string, boolean> = {};
    for (const r of rows) {
      result[r.pageKey] = r.enabled;
    }
    return result;
  } catch {
    return {};
  }
}

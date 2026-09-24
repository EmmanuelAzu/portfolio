import { createClient as createSupabase } from "@supabase/supabase-js";

// Portfolio content is public, so a cookie-less client lets pages be statically
// generated and revalidated instead of rendered per request.
function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Before Supabase is connected, render the fallback content instead of failing the build.
  if (!url || !key) return null;
  return createSupabase(url, key, { auth: { persistSession: false } });
}

export type Category = "academic" | "personal" | "commercial";

export interface Profile {
  full_name: string;
  headline: string;
  bio: string | null;
  location: string | null;
  email: string | null;
  avatar_url: string | null;
  links: Record<string, string>;
  skills: { group: string; items: string[] }[];
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: Category;
  short_description: string;
  detailed_markdown: string;
  tech_stack: string[] | null;
  featured_image_url: string | null;
  gallery_urls: string[] | null;
  github_url: string | null;
  live_demo_url: string | null;
  order_index: number;
}

export interface TimelineEntry {
  id: string;
  title: string;
  organization: string;
  type: "education" | "experience" | "award" | "publication" | "certification";
  start_date: string;
  end_date: string | null;
  date_precision: "month" | "year";
  description: string | null;
  skills_acquired: string[] | null;
}

export const FALLBACK_PROFILE: Profile = {
  full_name: "Your Name",
  headline: "Software developer",
  bio: null,
  location: null,
  email: null,
  avatar_url: null,
  links: {},
  skills: [],
};

export async function getProfile(): Promise<Profile> {
  const db = publicClient();
  if (!db) return FALLBACK_PROFILE;
  const { data } = await db.from("site_profile").select("*").maybeSingle<Profile>();
  if (!data) return FALLBACK_PROFILE;
  return { ...data, links: data.links ?? {}, skills: normalizeSkills(data.skills) };
}

/** Accepts the ordered-array format and the older `{ group: items }` object format. */
function normalizeSkills(raw: unknown): Profile["skills"] {
  if (Array.isArray(raw)) {
    return raw.filter((s) => s && typeof s.group === "string" && Array.isArray(s.items));
  }
  if (raw && typeof raw === "object") {
    return Object.entries(raw as Record<string, unknown>)
      .filter((entry): entry is [string, string[]] => Array.isArray(entry[1]))
      .map(([group, items]) => ({ group, items }));
  }
  return [];
}

export async function getProjects(): Promise<Project[]> {
  const db = publicClient();
  if (!db) return [];
  const { data } = await db.from("portfolio_projects").select("*").order("order_index").returns<Project[]>();
  return data ?? [];
}

export async function getProject(slug: string): Promise<Project | null> {
  const db = publicClient();
  if (!db) return null;
  const { data } = await db.from("portfolio_projects").select("*").eq("slug", slug).maybeSingle<Project>();
  return data;
}

export async function getTimeline(): Promise<TimelineEntry[]> {
  const db = publicClient();
  if (!db) return [];
  const { data } = await db
    .from("career_timeline")
    .select("*")
    .order("start_date", { ascending: false })
    .returns<TimelineEntry[]>();
  return data ?? [];
}

export function formatRange(start: string, end: string | null, precision: "month" | "year" = "month") {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: precision === "month" ? "short" : undefined,
      year: "numeric",
      timeZone: "UTC",
    });
  if (!end) return `${fmt(start)} – Present`;
  // One-off items (awards, publications) and single-month roles show a single date.
  return fmt(start) === fmt(end) ? fmt(start) : `${fmt(start)} – ${fmt(end)}`;
}

export function isVideo(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

/** Placeholder rows in the seed start with "TODO"; hide them from visitors. */
export function isPlaceholder(text: string | null | undefined) {
  return !text || text.trim().startsWith("TODO");
}

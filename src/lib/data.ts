import { createClient as createSupabase } from "@supabase/supabase-js";

// Portfolio content is public, so a cookie-less client lets pages be statically
// generated and revalidated instead of rendered per request.
function publicClient() {
  return createSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
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
  skills: Record<string, string[]>;
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
  type: "education" | "experience" | "award";
  start_date: string;
  end_date: string | null;
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
  skills: {},
};

export async function getProfile(): Promise<Profile> {
  const { data } = await publicClient().from("site_profile").select("*").maybeSingle<Profile>();
  return data ?? FALLBACK_PROFILE;
}

export async function getProjects(): Promise<Project[]> {
  const { data } = await publicClient().from("portfolio_projects").select("*").order("order_index").returns<Project[]>();
  return data ?? [];
}

export async function getProject(slug: string): Promise<Project | null> {
  const { data } = await publicClient().from("portfolio_projects").select("*").eq("slug", slug).maybeSingle<Project>();
  return data;
}

export async function getTimeline(): Promise<TimelineEntry[]> {
  const { data } = await publicClient()
    .from("career_timeline")
    .select("*")
    .order("start_date", { ascending: false })
    .returns<TimelineEntry[]>();
  return data ?? [];
}

export function formatRange(start: string, end: string | null) {
  const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
  return `${fmt(start)} – ${end ? fmt(end) : "Present"}`;
}

export function isVideo(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

/** Placeholder rows in the seed start with "TODO"; hide them from visitors. */
export function isPlaceholder(text: string | null | undefined) {
  return !text || text.trim().startsWith("TODO");
}

import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { getProfile, getProjects, getTimeline, isPlaceholder } from "@/lib/data";
import { CvDocument } from "@/lib/cv-document";

export const runtime = "nodejs";
export const revalidate = 300;

/** GET /cv → the CV as a PDF, generated from the live Supabase content. */
export async function GET(req: Request) {
  const [profile, projects, timeline] = await Promise.all([getProfile(), getProjects(), getTimeline()]);
  const clean = {
    ...profile,
    bio: isPlaceholder(profile.bio) ? null : profile.bio,
    location: isPlaceholder(profile.location) ? null : profile.location,
    email: isPlaceholder(profile.email) ? null : profile.email,
  };

  const pdf = await renderToBuffer(
    createElement(CvDocument, {
      profile: clean,
      projects: projects.filter((p) => !isPlaceholder(p.title)),
      timeline: timeline.filter((t) => !isPlaceholder(t.title)),
    }) as Parameters<typeof renderToBuffer>[0],
  );

  const inline = new URL(req.url).searchParams.has("view");
  const filename = `${profile.full_name.replace(/[^\w]+/g, "-")}-CV.pdf`;
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${filename}"`,
    },
  });
}

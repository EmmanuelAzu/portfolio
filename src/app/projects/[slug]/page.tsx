import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ExternalLink, FolderGit2 } from "lucide-react";
import { getProject, getProjects, isPlaceholder } from "@/lib/data";
import { Gallery } from "@/components/portfolio/gallery";

export const revalidate = 300;

export async function generateStaticParams() {
  const projects = await getProjects().catch(() => []);
  return projects.filter((p) => !isPlaceholder(p.title)).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = await getProject((await params).slug);
  return project ? { title: project.title, description: project.short_description } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = await getProject((await params).slug);
  if (!project || isPlaceholder(project.title)) notFound();

  const media = [project.featured_image_url, ...(project.gallery_urls ?? [])].filter((u): u is string => !!u);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/#work" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4" /> All work
      </Link>
      <p className="mt-8 text-xs font-semibold tracking-widest text-secondary uppercase">{project.category}</p>
      <h1 className="mt-2 font-serif text-4xl text-primary sm:text-5xl">{project.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{project.short_description}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.live_demo_url && (
          <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
            <ExternalLink className="size-4" /> Live demo
          </a>
        )}
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:border-primary">
            <FolderGit2 className="size-4" /> Source
          </a>
        )}
      </div>

      {project.featured_image_url && (
        <div className="relative mt-10 aspect-video overflow-hidden rounded-2xl border border-border">
          <Image src={project.featured_image_url} alt="" fill sizes="(min-width: 896px) 896px, 100vw" className="object-cover" priority />
        </div>
      )}

      <article className="prose-folio mt-10">
        <ReactMarkdown>{project.detailed_markdown}</ReactMarkdown>
      </article>

      {project.tech_stack && (
        <div className="mt-10">
          <h2 className="mb-3 text-xs font-semibold tracking-widest text-secondary uppercase">Built with</h2>
          <ul className="flex flex-wrap gap-2">
            {project.tech_stack.map((t) => (
              <li key={t} className="rounded-full border border-border bg-card px-3 py-1 text-sm">
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {media.length > 1 && (
        <section className="mt-12">
          <h2 className="mb-4 font-serif text-2xl text-primary">Gallery</h2>
          <Gallery items={media} title={project.title} />
        </section>
      )}
    </main>
  );
}

import Image from "next/image";
import { FolderGit2, Globe, Mail, MapPin, UserRound } from "lucide-react";
import { getProfile, getProjects, getTimeline, isPlaceholder } from "@/lib/data";
import { ProjectGrid } from "@/components/portfolio/project-grid";
import { Timeline } from "@/components/portfolio/timeline";
import { ContactForm } from "@/components/portfolio/contact-form";

export const revalidate = 300;

const LINK_ICONS: Record<string, typeof Globe> = { github: FolderGit2, linkedin: UserRound, website: Globe };
const LINK_LABELS: Record<string, string> = { github: "GitHub", linkedin: "LinkedIn", website: "Website" };

export default async function Home() {
  const [profile, projects, timeline] = await Promise.all([getProfile(), getProjects(), getTimeline()]);
  const visibleProjects = projects.filter((p) => !isPlaceholder(p.title));
  const visibleTimeline = timeline.filter((t) => !isPlaceholder(t.title));
  const skills = Object.entries(profile.skills).filter(([, list]) => list.length);

  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-[1fr_auto]">
        <div>
          <p className="mb-4 text-sm font-medium tracking-[0.2em] text-secondary uppercase">Portfolio</p>
          <h1 className="font-serif text-5xl leading-tight text-primary sm:text-6xl">{profile.full_name}</h1>
          <p className="mt-3 text-xl text-foreground/80">{profile.headline}</p>
          {!isPlaceholder(profile.bio) && <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">{profile.bio}</p>}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {!isPlaceholder(profile.location) && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" /> {profile.location}
              </span>
            )}
            {Object.entries(profile.links).map(([key, url]) => {
              const Icon = LINK_ICONS[key] ?? Globe;
              return (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 capitalize hover:text-primary">
                  <Icon className="size-4" /> {LINK_LABELS[key] ?? key}
                </a>
              );
            })}
            {!isPlaceholder(profile.email) && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-primary">
                <Mail className="size-4" /> Email
              </a>
            )}
          </div>
        </div>
        {profile.avatar_url && (
          <div className="relative size-56 overflow-hidden rounded-full border-4 border-secondary/60 shadow-lg">
            <Image src={profile.avatar_url} alt={profile.full_name} fill sizes="224px" className="object-cover" priority />
          </div>
        )}
      </section>

      <section id="work" className="scroll-mt-20 border-t border-border bg-card/60 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-serif text-3xl text-primary">Selected work</h2>
          <ProjectGrid projects={visibleProjects} />
        </div>
      </section>

      <section id="journey" className="mx-auto grid max-w-6xl scroll-mt-20 gap-12 px-4 py-20 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="mb-8 font-serif text-3xl text-primary">Journey</h2>
          <Timeline entries={visibleTimeline} />
        </div>
        {skills.length > 0 && (
          <aside>
            <h2 className="mb-8 font-serif text-3xl text-primary">Toolkit</h2>
            <div className="space-y-5">
              {skills.map(([group, list]) => (
                <div key={group}>
                  <h3 className="mb-2 text-xs font-semibold tracking-widest text-secondary uppercase">{group}</h3>
                  <div className="flex flex-wrap gap-2">
                    {list.map((s) => (
                      <span key={s} className="rounded-full border border-border bg-card px-3 py-1 text-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </section>

      <section id="contact" className="scroll-mt-20 bg-primary py-20 text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl">Let&apos;s build something.</h2>
            <p className="mt-4 max-w-md text-primary-foreground/80">
              Have a project, a role or an idea? Send a note and I&apos;ll get back to you.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        © {new Date().getFullYear()} {profile.full_name}
      </footer>
    </main>
  );
}

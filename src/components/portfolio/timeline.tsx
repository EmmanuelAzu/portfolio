import { Award, Briefcase, GraduationCap } from "lucide-react";
import { formatRange, type TimelineEntry } from "@/lib/data";

const ICONS = { education: GraduationCap, experience: Briefcase, award: Award };

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  if (!entries.length) return <p className="text-muted-foreground">Timeline coming soon.</p>;
  return (
    <ol className="relative border-l border-secondary/50">
      {entries.map((e) => {
        const Icon = ICONS[e.type];
        return (
          <li key={e.id} className="mb-10 ml-8">
            <span className="absolute -left-4 flex size-8 items-center justify-center rounded-full border border-secondary bg-background">
              <Icon className="size-4 text-primary" />
            </span>
            <p className="text-xs tracking-wide text-muted-foreground">{formatRange(e.start_date, e.end_date)}</p>
            <h3 className="mt-1 font-semibold">{e.title}</h3>
            <p className="text-sm text-primary">{e.organization}</p>
            {e.description && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.description}</p>}
            {e.skills_acquired && e.skills_acquired.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">{e.skills_acquired.join(" · ")}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

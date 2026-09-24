"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category, Project } from "@/lib/data";

const FILTERS: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "commercial", label: "Commercial" },
  { id: "personal", label: "Personal" },
  { id: "academic", label: "Academic" },
];

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Category | "all">("all");
  const shown = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <LayoutGroup>
      <div className="mt-6 mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "relative rounded-full px-4 py-1.5 text-sm transition-colors",
              filter === f.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {filter === f.id && (
              <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />
            )}
            <span className="relative">{f.label}</span>
          </button>
        ))}
      </div>

      {/* Masonry via CSS columns; `layout` animates cards into their new slots when filtering */}
      <motion.div layout className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.article
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="mb-6 break-inside-avoid"
            >
              <Link
                href={`/projects/${p.slug}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
              >
                {p.featured_image_url && (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={p.featured_image_url}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <p className="text-xs font-semibold tracking-widest text-secondary uppercase">{p.category}</p>
                  <h3 className="mt-2 flex items-start justify-between gap-2 font-serif text-xl text-primary">
                    {p.title}
                    <ArrowUpRight className="size-5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.short_description}</p>
                  {p.tech_stack && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {p.tech_stack.map((t) => (
                        <li key={t} className="rounded bg-muted px-2 py-0.5 text-xs">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
      {shown.length === 0 && <p className="text-muted-foreground">Nothing in this category yet.</p>}
    </LayoutGroup>
  );
}

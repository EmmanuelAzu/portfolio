"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { isVideo } from "@/lib/data";

/** Thumbnail grid with a keyboard-navigable lightbox for images and video walkthroughs. */
export function Gallery({ items, title }: { items: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);

  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, step]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((url, i) => (
          <button
            key={url}
            onClick={() => setOpen(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted"
            aria-label={`Open ${isVideo(url) ? "video" : "image"} ${i + 1} of ${items.length}`}
          >
            {isVideo(url) ? (
              <>
                <video src={url} muted preload="metadata" className="size-full object-cover" />
                <Play className="absolute inset-0 m-auto size-10 rounded-full bg-primary/80 p-2.5 text-primary-foreground" />
              </>
            ) : (
              <Image src={url} alt="" fill sizes="(min-width: 640px) 33vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} gallery`}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              key={open}
              className="relative h-[80vh] w-full max-w-5xl"
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              {isVideo(items[open]) ? (
                <video src={items[open]} controls autoPlay className="size-full object-contain" />
              ) : (
                <Image src={items[open]} alt={`${title}, image ${open + 1}`} fill sizes="100vw" className="object-contain" />
              )}
            </motion.div>
            <p className="absolute bottom-6 text-sm text-white/70">
              {open + 1} / {items.length}
            </p>
            <button onClick={() => setOpen(null)} className="absolute top-4 right-4 rounded-full p-2 text-white hover:bg-white/10" aria-label="Close">
              <X />
            </button>
            {items.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-4 rounded-full p-2 text-white hover:bg-white/10" aria-label="Previous">
                  <ChevronLeft className="size-8" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-4 rounded-full p-2 text-white hover:bg-white/10" aria-label="Next">
                  <ChevronRight className="size-8" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

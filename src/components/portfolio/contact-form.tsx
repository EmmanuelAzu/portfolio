"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    setError("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    if (res.ok) {
      setState("sent");
      form.reset();
    } else {
      setError((await res.json().catch(() => ({}))).error ?? "Something went wrong.");
      setState("idle");
    }
  }

  if (state === "sent") {
    return <p className="self-center font-serif text-2xl text-secondary">Thank you. Your message is on its way.</p>;
  }

  const field = "border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50";
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <Input name="name" required maxLength={120} placeholder="Your name" aria-label="Your name" className={field} />
      <Input name="email" type="email" required placeholder="you@example.com" aria-label="Email" className={field} />
      <Textarea name="message" required minLength={10} maxLength={5000} rows={5} placeholder="What's on your mind?" aria-label="Message" className={field} />
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <Button type="submit" disabled={state === "sending"} className="self-start bg-secondary text-secondary-foreground hover:bg-secondary/90">
        <Send /> {state === "sending" ? "Sending…" : "Send message"}
      </Button>
      {error && <p className="text-sm text-secondary">{error}</p>}
    </form>
  );
}

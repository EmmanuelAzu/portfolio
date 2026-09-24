import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

const ContactBody = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(254),
  message: z.string().trim().min(10).max(5000),
  // Honeypot: real visitors never see or fill this field.
  company: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = ContactBody.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your name, email and message (10+ characters)." }, { status: 422 });
  }

  // Bots that filled the honeypot get a normal-looking success and nothing is stored.
  if (parsed.data.company) return NextResponse.json({ success: true }, { status: 201 });

  const supabase = await createClient();
  const { name, email, message } = parsed.data;
  // Insert-only policy: the anon key can write inquiries but never read them back.
  const { error } = await supabase.from("contact_inquiries").insert({ name, email, message });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not send your message. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ success: true }, { status: 201 });
}

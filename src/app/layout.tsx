import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, Geist } from "next/font/google";
import { getProfile } from "@/lib/data";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return { title: { default: profile.full_name, template: `%s · ${profile.full_name}` }, description: profile.headline };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${fraunces.variable} font-sans antialiased`}>
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3 text-sm">
            <Link href="/" className="mr-auto">
              <Image src="/logo.svg" alt="Home" width={36} height={36} />
            </Link>
            <Link href="/#work" className="hover:text-primary">
              Work
            </Link>
            <Link href="/#journey" className="hover:text-primary">
              Journey
            </Link>
            <Link href="/#contact" className="hover:text-primary">
              Contact
            </Link>
            <a
              href="/cv"
              className="rounded-full border border-secondary px-4 py-1.5 font-medium text-primary transition-colors hover:bg-secondary/15"
            >
              Download CV
            </a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}

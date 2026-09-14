import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://postsprint.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "PostSprint — Changelog → 7-day social launch sprint",
  description:
    "Paste a changelog, release notes, or new feature. Get day-by-day X posts, LinkedIn angle, Reddit/IH note, thread starter, hashtags, and CTA variants. Free preview. Full pack $1.",
  openGraph: {
    title: "PostSprint — 7-day launch posts from your changelog",
    description:
      "Ready-to-post social sprint for the thing you just shipped. Free preview in your browser.",
    type: "website",
    url: siteUrl,
    siteName: "PostSprint",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "PostSprint — Changelog → 7-day social sprint",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PostSprint",
    description:
      "Paste a changelog → get a 7-day social launch sprint ready to post.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <nav className="print:hidden border-b border-white/5 bg-[#0a0b0a]/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
              <Link
                href="/"
                className="text-sm font-bold tracking-tight text-lime-100"
              >
                Post<span className="text-lime-400">Sprint</span>
              </Link>
              <div className="flex items-center gap-4 text-sm">
                <Link
                  href="/create"
                  className="text-slate-300 transition hover:text-lime-200"
                >
                  Create
                </Link>
                <Link
                  href="/create"
                  className="rounded-lg bg-lime-400 px-3 py-1.5 text-xs font-semibold text-[#0a0b0a] hover:bg-lime-300"
                >
                  Get started — free
                </Link>
              </div>
            </div>
          </nav>
          <div className="flex-1">{children}</div>
          <footer className="print:hidden border-t border-white/5 py-8 text-center text-xs text-slate-500">
            <p>
              PostSprint · Changelog → 7-day social launch ·{" "}
              <a
                href="https://github.com/healthyhabitat/postsprint"
                className="text-slate-400 underline-offset-2 hover:text-lime-300 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}

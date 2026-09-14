import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UNLOCK_COOKIE, verifyUnlockToken } from "@/lib/unlock";

export default async function SuccessPage() {
  const jar = await cookies();
  const unlocked = await verifyUnlockToken(jar.get(UNLOCK_COOKIE)?.value);

  if (!unlocked) {
    redirect("/create?unlock_error=1");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-16">
      <div className="rounded-2xl border border-lime-500/30 bg-[#141614]/90 p-8 text-center shadow-[0_0_60px_-15px_rgba(163,230,53,0.35)]">
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-lime-500/20 text-2xl text-lime-400"
          aria-hidden
        >
          ✓
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-lime-100">
          You&apos;re unlocked
        </h1>
        <p className="mt-3 text-slate-300 leading-relaxed">
          Full sprint is live: days 5–7, thread starter, CTA variants, Markdown
          download, and one regenerate. Go post day 1.
        </p>
        <Link
          href="/create?unlocked=1"
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-lime-400 px-6 py-3.5 text-base font-semibold text-[#0a0b0a] transition hover:bg-lime-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
        >
          Open your sprint →
        </Link>
      </div>
    </main>
  );
}

import Link from "next/link";

const benefits = [
  {
    title: "7 day-by-day X posts",
    body: "Announce → problem → deep dive → story → how-to → behind the build → close. Ready to paste.",
  },
  {
    title: "LinkedIn + community",
    body: "A LinkedIn angle plus a short Reddit / IndieHackers note about THIS launch.",
  },
  {
    title: "Thread + hashtags + CTAs",
    body: "Thread starter, hashtag set, and CTA variants matched to your tone.",
  },
  {
    title: "About your ship — not meta advice",
    body: "Every line references your changelog or feature. Never a generic “how to market” kit.",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:pb-24 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-lime-300">
            <span aria-hidden>⚡</span> 7-day social launch sprint
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-lime-50 sm:text-5xl sm:leading-[1.1]">
            Paste a changelog.
            <span className="block bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
              Get a week of ready-to-post launch content.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
            PostSprint turns release notes or a new feature into day-by-day X
            posts, a LinkedIn angle, Reddit/IH note, thread starter, hashtags,
            and CTA variants — so you can launch in public without staring at a
            blank composer.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/create"
              className="inline-flex w-full items-center justify-center rounded-xl bg-lime-400 px-8 py-3.5 text-base font-semibold text-[#0a0b0a] shadow-[0_0_40px_-8px_rgba(163,230,53,0.55)] transition hover:bg-lime-300 sm:w-auto"
            >
              Generate my sprint — free →
            </Link>
            <p className="text-sm text-slate-400">
              Free preview in this browser · Full unlock{" "}
              <span className="font-semibold text-lime-300">$1</span>
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#141614]/50 px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-lime-50">
            Everything you need for a 7-day launch
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-slate-400">
            Not another marketing course. Posts about the thing you just
            shipped.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-white/8 bg-[#0a0b0a]/60 p-5"
              >
                <h3 className="font-semibold text-lime-200">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-bold text-lime-50">
            Three steps to a louder launch
          </h2>
          <ol className="mt-8 space-y-4">
            {[
              "Paste your changelog or feature. Optional: product name, audience, tone.",
              "Get a full 7-day sprint in seconds — copy any block.",
              "Post day 1 today. Schedule the rest. Close the week with feedback.",
            ].map((step, i) => (
              <li
                key={step}
                className="flex gap-4 rounded-2xl border border-white/8 bg-[#141614]/60 p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-400 text-sm font-bold text-[#0a0b0a]">
                  {i + 1}
                </span>
                <p className="pt-1 text-slate-200">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-lime-500/30 bg-gradient-to-br from-lime-500/10 to-transparent p-8 text-center">
          <h2 className="text-2xl font-bold text-lime-50">
            Free preview. $1 to keep the full sprint.
          </h2>
          <p className="mt-3 text-slate-300 leading-relaxed">
            Generate a preview free in this browser. Unlock days 5–7, thread
            starter, CTA variants, Markdown download, and one regenerate — all
            for a single dollar.
          </p>
          <Link
            href="/create"
            className="mt-6 inline-flex rounded-xl bg-lime-400 px-8 py-3.5 text-base font-semibold text-[#0a0b0a] hover:bg-lime-300"
          >
            Start free →
          </Link>
        </div>
      </section>
    </main>
  );
}

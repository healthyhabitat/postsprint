"use client";

import { ResultBlock } from "./ResultBlock";
import { UnlockBanner } from "./UnlockBanner";
import { useCheckout } from "@/hooks/useCheckout";
import { packToMarkdown } from "@/lib/generator";
import type { SprintPack } from "@/lib/types";

const NAV = [
  { href: "#days", label: "7 days" },
  { href: "#linkedin", label: "LinkedIn" },
  { href: "#community", label: "Community" },
  { href: "#thread", label: "Thread" },
  { href: "#extras", label: "Tags & CTAs" },
] as const;

export function ResultsView({
  pack,
  unlocked,
  paymentsConfigured,
  canMock,
  onRegenerate,
  canRegenerate,
  regenerating,
}: {
  pack: SprintPack;
  unlocked: boolean;
  paymentsConfigured: boolean;
  canMock: boolean;
  onRegenerate?: () => void;
  canRegenerate?: boolean;
  regenerating?: boolean;
}) {
  const { busy, notice, unlock, ctaLabel } = useCheckout({
    paymentsConfigured,
    canMock,
  });

  function downloadMd() {
    const md = packToMarkdown(pack);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pack.productName.replace(/[^\w]+/g, "-").toLowerCase()}-sprint.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const unlockBtn = (
    <button
      type="button"
      onClick={unlock}
      disabled={busy}
      className="rounded-lg bg-lime-400 px-3 py-1.5 text-sm font-semibold text-[#0a0b0a] transition hover:bg-lime-300 disabled:opacity-60"
    >
      {busy ? "Starting…" : "Unlock full sprint — $1"}
    </button>
  );

  return (
    <div className="relative space-y-4 pb-24 print:space-y-3 print:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-lime-400/80">
            Your 7-day sprint
          </p>
          <h2 className="text-2xl font-bold text-lime-50 sm:text-3xl">
            {pack.productName}
          </h2>
          <p className="mt-1 text-sm text-slate-400">{pack.headline}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {unlocked ? (
            <button
              type="button"
              onClick={downloadMd}
              className="rounded-lg border border-lime-500/30 bg-lime-500/10 px-3 py-1.5 text-sm font-medium text-lime-100 hover:bg-lime-500/20"
            >
              Download Markdown
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled
                title="Unlock for $1 to download"
                className="cursor-not-allowed rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-500"
              >
                Download Markdown 🔒
              </button>
              {unlockBtn}
            </>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-white/20"
          >
            Print
          </button>
          {unlocked && canRegenerate && onRegenerate ? (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={regenerating}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-white/20 disabled:opacity-50"
            >
              {regenerating ? "Regenerating…" : "Regenerate (1×)"}
            </button>
          ) : null}
        </div>
      </div>

      <nav
        aria-label="Results sections"
        className="sticky top-0 z-20 -mx-1 flex gap-1 overflow-x-auto rounded-xl border border-white/8 bg-[#0a0b0a]/90 p-1.5 backdrop-blur-md print:hidden"
      >
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-lime-200"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {!unlocked ? (
        <div className="print:hidden">
          <UnlockBanner
            paymentsConfigured={paymentsConfigured}
            canMock={canMock}
            onUnlock={unlock}
            busy={busy}
            notice={notice}
            ctaLabel={ctaLabel}
          />
        </div>
      ) : (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 print:hidden">
          Full sprint unlocked. Copy, download, and post.
        </p>
      )}

      <div id="days" className="scroll-mt-24 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Day-by-day X posts
        </p>
        {pack.dayPosts.map((d) => {
          const locked = !unlocked && d.day >= 5;
          return (
            <ResultBlock
              key={d.day}
              title={`Day ${d.day} — ${d.theme}`}
              copyText={!locked && d.xPost ? d.xPost : undefined}
              locked={locked}
              lockHint={`Unlock for $1 to reveal Day ${d.day} (${d.theme}).`}
              lockAction={!unlocked ? unlockBtn : undefined}
            >
              <pre className="whitespace-pre-wrap font-sans text-[15px]">
                {d.xPost}
              </pre>
            </ResultBlock>
          );
        })}
      </div>

      <div id="linkedin" className="scroll-mt-24">
        <ResultBlock title="LinkedIn angle" copyText={pack.linkedInAngle}>
          <pre className="whitespace-pre-wrap font-sans text-[15px]">
            {pack.linkedInAngle}
          </pre>
        </ResultBlock>
      </div>

      <div id="community" className="scroll-mt-24">
        <ResultBlock
          title="Reddit / IndieHackers note"
          copyText={pack.communityNote}
        >
          <pre className="whitespace-pre-wrap font-sans text-[15px]">
            {pack.communityNote}
          </pre>
        </ResultBlock>
      </div>

      <div id="thread" className="scroll-mt-24">
        <ResultBlock
          title="Thread starter"
          copyText={unlocked ? pack.threadStarter : undefined}
          locked={!unlocked}
          lockHint="Unlock for $1 to reveal the full thread starter."
          lockAction={!unlocked ? unlockBtn : undefined}
        >
          <pre className="whitespace-pre-wrap font-sans text-[15px]">
            {pack.threadStarter}
          </pre>
        </ResultBlock>
      </div>

      <div id="extras" className="scroll-mt-24 space-y-4">
        <ResultBlock
          title="Hashtag set"
          copyText={pack.hashtags.join(" ")}
        >
          <p className="flex flex-wrap gap-2">
            {pack.hashtags.map((h) => (
              <span
                key={h}
                className="rounded-full border border-lime-500/20 bg-lime-500/10 px-2.5 py-1 text-sm text-lime-200"
              >
                {h}
              </span>
            ))}
          </p>
        </ResultBlock>

        <ResultBlock
          title="CTA variants"
          copyText={
            unlocked ? pack.ctaVariants.map((c, i) => `${i + 1}. ${c}`).join("\n") : undefined
          }
          locked={!unlocked}
          lockHint="Unlock for $1 to reveal CTA variants."
          lockAction={!unlocked ? unlockBtn : undefined}
        >
          <ol className="list-decimal space-y-2 pl-5">
            {pack.ctaVariants.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
        </ResultBlock>
      </div>

      {!unlocked ? (
        <p className="text-center text-xs text-slate-500 print:block">
          Made with PostSprint
        </p>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0a0b0a]/95 px-4 py-3 backdrop-blur-md print:hidden">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-2">
          <p className="truncate text-sm text-slate-400">
            {unlocked ? "Full sprint unlocked" : "Preview · unlock days 5–7"}
          </p>
          <div className="flex flex-wrap gap-2">
            {unlocked ? (
              <button
                type="button"
                onClick={downloadMd}
                className="rounded-lg border border-lime-500/30 bg-lime-500/10 px-3 py-2 text-sm font-medium text-lime-100 hover:bg-lime-500/20"
              >
                Download Markdown
              </button>
            ) : (
              <>
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-500"
                >
                  Download 🔒
                </button>
                <button
                  type="button"
                  onClick={unlock}
                  disabled={busy}
                  className="rounded-lg bg-lime-400 px-4 py-2 text-sm font-semibold text-[#0a0b0a] hover:bg-lime-300 disabled:opacity-60"
                >
                  {busy ? "Starting…" : "Unlock full sprint — $1"}
                </button>
              </>
            )}
          </div>
        </div>
        {notice && !unlocked ? (
          <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-lime-200/90">
            {notice}
          </p>
        ) : null}
      </div>
    </div>
  );
}

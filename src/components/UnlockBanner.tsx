"use client";

import { PAYMENTS_SOON_MESSAGE } from "@/lib/checkout-errors";

export function UnlockBanner({
  paymentsConfigured,
  canMock,
  onUnlock,
  busy,
  notice,
  ctaLabel,
}: {
  paymentsConfigured: boolean;
  canMock: boolean;
  onUnlock: () => void;
  busy: boolean;
  notice: string | null;
  ctaLabel: string;
}) {
  const paymentsSoon = !paymentsConfigured && !canMock;

  return (
    <div className="rounded-2xl border border-lime-500/40 bg-gradient-to-br from-lime-500/15 to-emerald-600/10 p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-lime-400">
        Free preview · unlock full sprint
      </p>
      <h3 className="mt-1 text-xl font-bold text-lime-50">
        Get everything for $1
      </h3>
      <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
        <li>✓ Days 5–7 X posts</li>
        <li>✓ Thread starter + CTA variants</li>
        <li>✓ Markdown download of the full sprint</li>
        <li>✓ Remove the “Made with PostSprint” mark</li>
        <li>✓ One free regenerate</li>
      </ul>

      <button
        type="button"
        onClick={onUnlock}
        disabled={busy}
        className="mt-5 w-full rounded-xl bg-lime-400 px-5 py-3 text-sm font-semibold text-[#0a0b0a] transition hover:bg-lime-300 disabled:opacity-60"
      >
        {ctaLabel}
      </button>

      {paymentsSoon && !notice ? (
        <p className="mt-3 text-sm text-slate-400">{PAYMENTS_SOON_MESSAGE}</p>
      ) : null}

      {notice ? (
        <p
          className="mt-3 rounded-lg border border-lime-500/20 bg-[#0a0b0a]/50 px-3 py-2 text-sm text-lime-100"
          role="status"
        >
          {notice}
        </p>
      ) : null}
    </div>
  );
}

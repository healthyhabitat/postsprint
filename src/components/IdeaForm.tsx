"use client";

import { useState } from "react";
import type { Tone } from "@/lib/types";

export interface FormValues {
  changelog: string;
  productName: string;
  audience: string;
  tone: Tone;
}

export function IdeaForm({
  onSubmit,
  loading,
  initial,
}: {
  onSubmit: (values: FormValues) => void;
  loading?: boolean;
  initial?: Partial<FormValues>;
}) {
  const [changelog, setChangelog] = useState(initial?.changelog ?? "");
  const [productName, setProductName] = useState(initial?.productName ?? "");
  const [audience, setAudience] = useState(initial?.audience ?? "");
  const [tone, setTone] = useState<Tone>(initial?.tone ?? "calm");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (changelog.trim().length < 3) {
      setError("Paste a changelog, release notes, or feature description.");
      return;
    }
    setError(null);
    onSubmit({
      changelog: changelog.trim(),
      productName: productName.trim(),
      audience: audience.trim(),
      tone,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="changelog"
          className="mb-1.5 block text-sm font-medium text-slate-200"
        >
          Changelog / feature <span className="text-lime-400">*</span>
        </label>
        <textarea
          id="changelog"
          name="changelog"
          required
          rows={5}
          value={changelog}
          onChange={(e) => setChangelog(e.target.value)}
          placeholder="e.g. Shipped dark mode + keyboard shortcuts for PantryWeek. Users can plan meals without leaving the keyboard. Fixed grocery list sync lag."
          className="w-full resize-y rounded-xl border border-white/10 bg-[#0a0b0a] px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-lime-500/50 focus:outline-none focus:ring-2 focus:ring-lime-500/30"
          disabled={loading}
        />
        {error ? (
          <p className="mt-1.5 text-sm text-rose-400" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="productName"
          className="mb-1.5 block text-sm font-medium text-slate-200"
        >
          Product name{" "}
          <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <input
          id="productName"
          name="productName"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="e.g. PantryWeek"
          className="w-full rounded-xl border border-white/10 bg-[#0a0b0a] px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-lime-500/50 focus:outline-none focus:ring-2 focus:ring-lime-500/30"
          disabled={loading}
        />
      </div>

      <div>
        <label
          htmlFor="audience"
          className="mb-1.5 block text-sm font-medium text-slate-200"
        >
          Audience{" "}
          <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <input
          id="audience"
          name="audience"
          type="text"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="e.g. busy parents who meal-plan on Sundays"
          className="w-full rounded-xl border border-white/10 bg-[#0a0b0a] px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-lime-500/50 focus:outline-none focus:ring-2 focus:ring-lime-500/30"
          disabled={loading}
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-200">Tone</legend>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ["hype", "Hype"],
              ["calm", "Calm"],
              ["technical", "Technical"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition ${
                tone === value
                  ? "border-lime-500/60 bg-lime-500/15 text-lime-100"
                  : "border-white/10 bg-[#0a0b0a] text-slate-400 hover:border-white/20"
              }`}
            >
              <input
                type="radio"
                name="tone"
                value={value}
                checked={tone === value}
                onChange={() => setTone(value)}
                className="sr-only"
                disabled={loading}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-3.5 text-base font-semibold text-[#0a0b0a] transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0a0b0a]/30 border-t-[#0a0b0a]" />
            Building your 7-day sprint…
          </>
        ) : (
          "Generate my launch sprint →"
        )}
      </button>
    </form>
  );
}

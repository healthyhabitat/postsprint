"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IdeaForm, type FormValues } from "./IdeaForm";
import { ResultsView } from "./ResultsView";
import type { SprintPack } from "@/lib/types";

const STORAGE_KEY = "ps_last_pack";
const FORM_KEY = "ps_last_form";
const REGEN_KEY = "ps_regen_used";

export function CreateApp({
  initialUnlocked = false,
}: {
  initialUnlocked?: boolean;
}) {
  const [pack, setPack] = useState<SprintPack | null>(null);
  const [lastForm, setLastForm] = useState<FormValues | null>(null);
  const [unlocked, setUnlocked] = useState(initialUnlocked);
  const [paymentsConfigured, setPaymentsConfigured] = useState(false);
  const [canMock, setCanMock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regenUsed, setRegenUsed] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const refreshed = useRef(false);

  const persistPack = (p: SprintPack) => {
    setPack(p);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {
      /* ignore */
    }
  };

  const generate = useCallback(async (values: FormValues) => {
    setLoading(true);
    setError(null);
    setLastForm(values);
    try {
      sessionStorage.setItem(FORM_KEY, JSON.stringify(values));
    } catch {
      /* ignore */
    }
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as {
        pack?: SprintPack;
        unlocked?: boolean;
        error?: string;
      };
      if (!res.ok || !data.pack) {
        setError(data.error ?? "Generation failed.");
        setLoading(false);
        return;
      }
      persistPack(data.pack);
      if (typeof data.unlocked === "boolean") setUnlocked(data.unlocked);
    } catch {
      setError("Network error — check your connection and try again.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch("/api/unlock/status")
      .then((r) => r.json())
      .then(
        (d: {
          unlocked?: boolean;
          paymentsConfigured?: boolean;
          canMock?: boolean;
        }) => {
          if (d.unlocked) setUnlocked(true);
          setPaymentsConfigured(Boolean(d.paymentsConfigured));
          setCanMock(Boolean(d.canMock));
        }
      )
      .catch(() => {});

    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setPack(JSON.parse(raw) as SprintPack);
      const formRaw = sessionStorage.getItem(FORM_KEY);
      if (formRaw) setLastForm(JSON.parse(formRaw) as FormValues);
      setRegenUsed(sessionStorage.getItem(REGEN_KEY) === "1");
    } catch {
      /* ignore */
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("canceled") === "1")
      setBanner("Checkout canceled — no charge.");
    if (params.get("unlock_error") === "1")
      setBanner("Could not verify payment. Try again or contact support.");
    if (params.get("unlocked") === "1")
      setBanner("Welcome back — full sprint unlocked.");
  }, []);

  useEffect(() => {
    if (!unlocked || refreshed.current) return;
    let form = lastForm;
    if (!form) {
      try {
        const formRaw = sessionStorage.getItem(FORM_KEY);
        if (formRaw) form = JSON.parse(formRaw) as FormValues;
      } catch {
        /* ignore */
      }
    }
    if (!form) return;
    refreshed.current = true;
    void generate(form);
  }, [unlocked, lastForm, generate]);

  async function regenerate() {
    if (!lastForm || regenUsed) return;
    sessionStorage.setItem(REGEN_KEY, "1");
    setRegenUsed(true);
    await generate({
      ...lastForm,
      audience: lastForm.audience
        ? `${lastForm.audience} `
        : `builders ${Date.now() % 97}`,
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-lime-400">
          PostSprint · Create
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-lime-50 sm:text-4xl">
          Paste a changelog. Get a 7-day sprint.
        </h1>
        <p className="mt-2 text-slate-400">
          Free preview in this browser (days 1–4). Unlock days 5–7, thread,
          CTAs, Markdown, and one regenerate for $1.
        </p>
      </header>

      {banner ? (
        <p
          className="mb-6 rounded-xl border border-lime-500/20 bg-lime-500/10 px-4 py-2.5 text-sm text-lime-100"
          role="status"
        >
          {banner}
        </p>
      ) : null}

      <div className="rounded-2xl border border-white/8 bg-[#141614]/80 p-5 sm:p-6">
        <IdeaForm
          onSubmit={generate}
          loading={loading}
          initial={lastForm ?? undefined}
        />
      </div>

      {error ? (
        <p
          className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {loading && !pack ? (
        <div
          className="mt-8 animate-pulse space-y-3"
          aria-busy="true"
          aria-label="Loading"
        >
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : null}

      {!loading && !pack && !error ? (
        <p className="mt-8 text-center text-sm text-slate-500">
          Your sprint will show up here — day-by-day posts, LinkedIn, thread,
          hashtags, and CTAs.
        </p>
      ) : null}

      {pack ? (
        <div className="mt-10">
          <ResultsView
            pack={pack}
            unlocked={unlocked}
            paymentsConfigured={paymentsConfigured}
            canMock={canMock}
            onRegenerate={regenerate}
            canRegenerate={!regenUsed}
            regenerating={loading}
          />
        </div>
      ) : null}
    </div>
  );
}

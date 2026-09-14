import type { DayPost, SprintInput, SprintPack, Tone } from "./types";

/** Simple deterministic hash for seeding template choices */
export function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(arr: readonly T[], seed: number, salt = 0): T {
  return arr[(seed + salt) % arr.length];
}

function clean(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").replace(/[.!?]+$/, "");
}

const PRESERVE_CASE: Record<string, string> = {
  ai: "AI",
  api: "API",
  ios: "iOS",
  saas: "SaaS",
  seo: "SEO",
  ui: "UI",
  ux: "UX",
  pdf: "PDF",
  gpt: "GPT",
  b2b: "B2B",
  crm: "CRM",
  csv: "CSV",
  sdk: "SDK",
  cli: "CLI",
  mvp: "MVP",
};

const SMALL_WORDS = new Set(["for", "of", "and", "the", "a", "an", "to", "in", "on", "or"]);

function titleWord(w: string, index = 0): string {
  if (w.includes("-")) {
    return w.split("-").map((p, i) => titleWord(p, index + i)).join("-");
  }
  const lower = w.toLowerCase();
  if (PRESERVE_CASE[lower]) return PRESERVE_CASE[lower];
  if (index > 0 && SMALL_WORDS.has(lower)) return lower;
  if (/[0-9]/.test(w) && /^[A-Za-z0-9]+$/.test(w)) return w.toUpperCase();
  return w.length ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w;
}

function titleCase(s: string): string {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w, i) => titleWord(w, i))
    .join(" ");
}

function sentenceCase(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const STOP = new Set([
  "a", "an", "the", "for", "to", "of", "and", "or", "with", "that", "this",
  "my", "i", "we", "our", "you", "your", "just", "like", "from", "into",
  "about", "so", "they", "their", "do", "not", "dont", "does", "did",
  "is", "are", "be", "been", "being", "it", "its", "in", "on", "at",
  "by", "as", "if", "when", "while", "than", "then", "also", "using",
  "use", "used", "via", "have", "has", "had", "get", "gets", "got",
  "new", "now", "shipped", "shipping", "launch", "launched", "release",
  "released", "version", "update", "updated", "feature", "features",
  "changelog", "notes", "added", "add", "adds", "fix", "fixed", "fixes",
  "improve", "improved", "improves", "improvement", "support", "supports",
  "introducing", "announce", "announcing", "today", "finally", "built",
]);

export interface ParsedLaunch {
  raw: string;
  bullets: string[];
  primary: string;
  productName: string;
  audience: string;
  keywords: string[];
  vibeNoun: string;
}

function splitBullets(text: string): string[] {
  const lines = text
    .split(/\n|[•●▪︎]|(?:^|\s)[-*]\s+|(?:\d+[.)]\s+)/)
    .map((l) => l.trim())
    .filter((l) => l.length > 8);
  if (lines.length >= 2) return lines.slice(0, 6).map(clean);
  // Sentence-ish split for prose changelogs
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => clean(s))
    .filter((s) => s.length > 12);
  if (sentences.length >= 2) return sentences.slice(0, 5);
  return [clean(text)].filter(Boolean);
}

function significantWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

function inferProductName(changelog: string, hint?: string): string {
  if (hint?.trim()) {
    // Preserve user-provided casing (PantryWeek, InvoiceOS, etc.)
    return hint.trim();
  }
  const named = changelog.match(
    /\b(?:in|for|of|with)\s+([A-Z][A-Za-z0-9]+(?:\s+[A-Z][A-Za-z0-9]+)?)\b/
  );
  if (named) return named[1];
  const quoted = changelog.match(/["“]([A-Za-z0-9][\w\s-]{1,32})["”]/);
  if (quoted) return titleCase(quoted[1]);
  const words = significantWords(changelog).slice(0, 3);
  if (words.length >= 2) return titleCase(words.slice(0, 2).join(" "));
  if (words.length === 1) return titleCase(words[0]);
  return "Your Launch";
}

function inferAudience(changelog: string, audience?: string): string {
  if (audience?.trim()) return audience.trim();
  const lower = changelog.toLowerCase();
  if (/writer|blog|content|newsletter/.test(lower)) return "writers and creators";
  if (/design|figma|ui/.test(lower)) return "designers shipping faster";
  if (/founder|startup|indie/.test(lower)) return "indie founders";
  if (/developer|dev|api|sdk|cli|engineer/.test(lower)) return "builders and developers";
  if (/market|seo|growth|ads/.test(lower)) return "growth marketers";
  if (/freelance|client|agency/.test(lower)) return "freelancers and agencies";
  if (/team|saas|b2b/.test(lower)) return "product teams";
  if (/parent|family/.test(lower)) return "busy parents";
  return "people who care about this problem";
}

function vibeNoun(primary: string, keywords: string[]): string {
  const pool = [...keywords, ...significantWords(primary)].filter(Boolean);
  return pool[0] ?? "update";
}


function stripLeadVerb(s: string): string {
  return s
    .replace(/^(?:shipped|shipping|launched|launching|released|releasing|added|adding|introducing|announcing|built|fixed|fixing)\s+/i, "")
    .replace(/^(?:we\s+)?(?:just\s+)?(?:shipped|launched|released)\s+/i, "")
    .trim() || s;
}

export function parseLaunch(
  changelog: string,
  productHint?: string,
  audienceHint?: string
): ParsedLaunch {
  const raw = changelog.trim().replace(/\r\n/g, "\n");
  if (!raw || raw.length < 3) {
    throw new Error("Changelog / feature must be at least 3 characters.");
  }
  const bullets = splitBullets(raw).map(stripLeadVerb);
  const primary = bullets[0] || stripLeadVerb(clean(raw));
  const productName = inferProductName(raw, productHint);
  const audience = inferAudience(raw, audienceHint);
  const keywords = significantWords(raw).slice(0, 8);
  return {
    raw,
    bullets,
    primary,
    productName,
    audience,
    keywords,
    vibeNoun: vibeNoun(primary, keywords),
  };
}

const DAY_THEMES = [
  "Announce",
  "Problem → fix",
  "Deep dive",
  "Social proof / story",
  "How to try it",
  "Behind the build",
  "Close the week",
] as const;

function toneHooks(tone: Tone, product: string, primary: string, audience: string) {
  const p = sentenceCase(primary);
  if (tone === "hype") {
    return {
      announce: [
        `🚀 ${product} just shipped.\n\n${p}.\n\nIf you're ${audience}, this one's for you.`,
        `It's live.\n\n${product}: ${p}.\n\nTag someone who needed this yesterday.`,
        `New drop from ${product} 🔥\n\n${p}.\n\nLink in bio / reply.`,
      ],
      problem: [
        `You know that friction around "${primary.toLowerCase()}"?\n\nWe killed it in ${product}.\n\nHere's what changed →`,
        `${audience} kept hitting the same wall.\n\n${product} now: ${p}.\n\nTry it this week.`,
      ],
      deep: [
        `Under the hood of ${product}'s latest:\n\n• ${primary}\n\nWorth 60 seconds if you care about shipping.`,
        `Quick walkthrough — what ${product} actually unlocked:\n\n${p}.`,
      ],
      story: [
        `We built this because ${audience} asked for it.\n\n${product} now does: ${primary.toLowerCase()}.\n\nWhat should we ship next?`,
        `A week ago this was a rough note.\n\nToday ${product} ships: ${p}.`,
      ],
      how: [
        `How to try ${product}'s new bit in 2 minutes:\n\n1. Open it\n2. Find the update\n3. Run ${primary.toLowerCase()}\n\nThat's it.`,
        `Fast path for ${audience}:\n\nOpen ${product} → use the new flow → ${primary.toLowerCase()}.`,
      ],
      behind: [
        `Behind ${product}'s release: we cut scope until only "${primary.toLowerCase()}" remained.\n\nShip thin. Iterate loud.`,
        `Build note: ${product} almost didn't include this.\n\nGlad we did — ${p}.`,
      ],
      close: [
        `Day 7 reminder: ${product}'s update is live.\n\n${p}.\n\nIf you tried it — reply with one takeaway.`,
        `Closing the launch week for ${product}.\n\nBiggest change: ${primary.toLowerCase()}.\n\nStill curious what you think.`,
      ],
    };
  }
  if (tone === "technical") {
    return {
      announce: [
        `${product} release notes, short version:\n\n${p}.\n\nDetails in the changelog — feedback welcome from ${audience}.`,
        `Shipped in ${product}: ${primary.toLowerCase()}.\n\nDesigned for ${audience} who live in the weeds.`,
      ],
      problem: [
        `Before: friction around ${primary.toLowerCase()}.\nAfter: handled in ${product}.\n\nSame stack, clearer path.`,
        `We removed a step ${audience} hit every time.\n\n${product}: ${p}.`,
      ],
      deep: [
        `${product} change set focus:\n\n• ${primary}\n\nNo fluff — this is the part that compounds.`,
        `Implementation note for ${audience}:\n\n${p}\n\nEdge cases welcome in replies.`,
      ],
      story: [
        `Why this landed in ${product}: ${audience} kept filing the same request.\n\n${p}.`,
        `Scope dial: we almost shipped three features. Shipped one well — ${primary.toLowerCase()}.`,
      ],
      how: [
        `Try the ${product} update:\n\n1. Pull latest / open app\n2. Hit the new path\n3. Confirm ${primary.toLowerCase()}\n\nReport breaks.`,
        `Minimal repro for ${audience}: open ${product}, run the new flow, verify ${primary.toLowerCase()}.`,
      ],
      behind: [
        `Tradeoff we made in ${product}: fewer knobs, clearer default for ${primary.toLowerCase()}.`,
        `Release hygiene: one coherent change — ${p} — instead of a kitchen-sink dump.`,
      ],
      close: [
        `Week wrap on ${product}: ${primary.toLowerCase()} is in prod.\n\nPRs / issues / hot takes from ${audience} appreciated.`,
        `${product} launch week end. Core delta: ${p}.\n\nWhat should vNext prioritize?`,
      ],
    };
  }
  // calm
  return {
    announce: [
      `${product} has a new update.\n\n${p}.\n\nMade with ${audience} in mind.`,
      `Quiet launch: ${product} now helps you ${primary.toLowerCase()}.`,
    ],
    problem: [
      `If ${primary.toLowerCase()} has been a drag, ${product} should feel lighter now.`,
      `We noticed ${audience} struggling with this — so ${product} ships: ${p}.`,
    ],
    deep: [
      `A closer look at what's new in ${product}:\n\n${p}.\n\nTake it at your own pace.`,
      `${product} update, explained simply: ${primary.toLowerCase()}.`,
    ],
    story: [
      `This started as a note from ${audience}.\n\nIt became a real change in ${product}: ${primary.toLowerCase()}.`,
      `Small on purpose. ${product} focuses on ${primary.toLowerCase()} so you can move on with your day.`,
    ],
    how: [
      `To try it: open ${product}, find the new flow, and ${primary.toLowerCase()}.\n\nTwo minutes is enough.`,
      `Gentle nudge: ${product}'s update is ready whenever you are.`,
    ],
    behind: [
      `We kept the ${product} release small so ${primary.toLowerCase()} would actually stick.`,
      `No big spectacle — just a clearer path in ${product} for ${audience}.`,
    ],
    close: [
      `End of launch week for ${product}.\n\nIf you tried ${primary.toLowerCase()}, we'd love one sentence of feedback.`,
      `${product} is live with: ${p}.\n\nThanks for reading along.`,
    ],
  };
}

function secondaryBullet(parsed: ParsedLaunch, i: number): string {
  return parsed.bullets[i] || parsed.bullets[0] || parsed.primary;
}

function buildDayPosts(
  parsed: ParsedLaunch,
  tone: Tone,
  seed: number
): DayPost[] {
  const { productName: product, primary, audience } = parsed;
  const hooks = toneHooks(tone, product, primary, audience);
  const b2 = secondaryBullet(parsed, 1);
  const b3 = secondaryBullet(parsed, 2);

  const deepExtra =
    parsed.bullets.length > 1
      ? `\n• ${b2}${parsed.bullets.length > 2 ? `\n• ${b3}` : ""}`
      : "";

  const posts: DayPost[] = [
    {
      day: 1,
      theme: DAY_THEMES[0],
      xPost: pick(hooks.announce, seed, 1),
    },
    {
      day: 2,
      theme: DAY_THEMES[1],
      xPost: pick(hooks.problem, seed, 2),
    },
    {
      day: 3,
      theme: DAY_THEMES[2],
      xPost: pick(hooks.deep, seed, 3).replace(
        primary,
        `${primary}${deepExtra}`
      ),
    },
    {
      day: 4,
      theme: DAY_THEMES[3],
      xPost: pick(hooks.story, seed, 4),
    },
    {
      day: 5,
      theme: DAY_THEMES[4],
      xPost: pick(hooks.how, seed, 5),
    },
    {
      day: 6,
      theme: DAY_THEMES[5],
      xPost: pick(hooks.behind, seed, 6),
    },
    {
      day: 7,
      theme: DAY_THEMES[6],
      xPost: pick(hooks.close, seed, 7),
    },
  ];

  return posts.map((p) => ({
    ...p,
    xPost: p.xPost.replace(/\s+\n/g, "\n").trim(),
  }));
}

function buildLinkedIn(
  parsed: ParsedLaunch,
  tone: Tone,
  seed: number
): string {
  const { productName, primary, audience, bullets } = parsed;
  const extras = bullets
    .slice(0, 3)
    .map((b) => `• ${sentenceCase(b)}`)
    .join("\n");

  const openings = {
    hype: [
      `Excited to share what just landed in ${productName}.`,
      `${productName} just leveled up — and ${audience} are going to feel it.`,
    ],
    calm: [
      `A short note on what's new in ${productName}.`,
      `We shipped a focused update in ${productName} for ${audience}.`,
    ],
    technical: [
      `Release note for ${productName} (practitioner edition).`,
      `${productName} change summary for ${audience}:`,
    ],
  } as const;

  const closes = {
    hype: `If this is on your roadmap, jump in this week. Curious what you ship with it.`,
    calm: `Happy to answer questions — or hear what you'd improve next.`,
    technical: `Feedback, edge cases, and repros welcome. Let's harden it together.`,
  } as const;

  return `${pick(openings[tone], seed, 20)}

${sentenceCase(primary)}.

What changed:
${extras}

Built for ${audience}.

${closes[tone]}`;
}

function buildCommunity(parsed: ParsedLaunch, tone: Tone): string {
  const { productName, primary, audience, bullets } = parsed;
  const list = bullets
    .slice(0, 3)
    .map((b) => `• ${sentenceCase(b)}`)
    .join("\n");
  const ask =
    tone === "technical"
      ? "What would you harden first?"
      : tone === "hype"
        ? "Would this help you this week?"
        : "Does this solve a real pain for you?";

  return `I just shipped an update to ${productName}.

**${productName}**
${sentenceCase(primary)}.

Highlights:
${list}

Built with ${audience} in mind.

${ask}

Happy to share a link / demo in the comments.`;
}

function buildThread(parsed: ParsedLaunch, tone: Tone, seed: number): string {
  const { productName, primary, audience, bullets } = parsed;
  const b2 = secondaryBullet(parsed, 1);
  const b3 = secondaryBullet(parsed, 2);

  const openers = {
    hype: `1/ ${productName} just shipped something ${audience} asked for.`,
    calm: `1/ A quiet thread on what ${productName} shipped this week.`,
    technical: `1/ Thread: ${productName} release — what changed and why.`,
  } as const;

  return `${openers[tone]}

2/ The core change: ${primary.toLowerCase()}.

3/ Also worth knowing: ${b2.toLowerCase()}.

4/ ${bullets.length > 2 ? `Plus: ${b3.toLowerCase()}.` : `We kept scope tight on purpose.`}

5/ Who it's for: ${audience}.

6/ Try it, break it, tell us what's missing.

7/ That's the launch. Link in the next reply / bio.`;
}

function buildHashtags(parsed: ParsedLaunch, seed: number): string[] {
  const base = ["#buildinpublic", "#indiehacker", "#shipping"];
  const kw = parsed.keywords
    .slice(0, 4)
    .map((k) => `#${k.replace(/[^a-z0-9]/gi, "")}`)
    .filter((h) => h.length > 2 && h.length < 24);
  const productTag = `#${parsed.productName.replace(/[^a-z0-9]/gi, "")}`;
  const extras = [
    "#SaaS",
    "#ProductLaunch",
    "#devtools",
    "#makers",
    "#startup",
    "#changelog",
  ];
  const picked = [productTag, ...kw, ...base, pick(extras, seed, 30), pick(extras, seed, 31)];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const h of picked) {
    const key = h.toLowerCase();
    if (seen.has(key) || h === "#") continue;
    seen.add(key);
    out.push(h);
    if (out.length >= 8) break;
  }
  return out;
}

function buildCtas(parsed: ParsedLaunch, tone: Tone, seed: number): string[] {
  const { productName, primary, audience } = parsed;
  const all = [
    `Try ${productName} → check out ${primary.toLowerCase()}.`,
    `Built for ${audience}. Open ${productName} today.`,
    `See ${productName}'s latest: ${primary.toLowerCase()}.`,
    `Curious? One click into ${productName}.`,
    tone === "hype"
      ? `Don't wait for the perfect week — try ${productName} now.`
      : tone === "technical"
        ? `Review the ${productName} change, then send edge cases.`
        : `Whenever you're ready — ${productName} is waiting.`,
    `Reply "link" and I'll send the ${productName} update.`,
    `Bookmark this: ${productName} — ${primary.toLowerCase()}.`,
    `Share with a teammate who lives this problem.`,
  ];
  // Deterministic rotate based on seed
  const start = seed % all.length;
  return [...all.slice(start), ...all.slice(0, start)].slice(0, 5);
}

function buildHeadline(parsed: ParsedLaunch, tone: Tone): string {
  if (tone === "hype") return `${parsed.productName} just shipped — ${parsed.primary}`;
  if (tone === "technical")
    return `${parsed.productName} release: ${parsed.primary}`;
  return `What's new in ${parsed.productName}: ${parsed.primary}`;
}

/**
 * Deterministic 7-day social launch sprint — works with zero API keys.
 * Same inputs → same outputs. Always posts about THIS launch, never meta marketing advice.
 */
export function generateSprintPack(input: SprintInput): SprintPack {
  const changelog = input.changelog.trim();
  if (!changelog || changelog.length < 3) {
    throw new Error("Changelog / feature must be at least 3 characters.");
  }
  const tone = input.tone ?? "calm";
  const parsed = parseLaunch(changelog, input.productName, input.audience);
  const seedStr = `${changelog}|${parsed.productName}|${parsed.audience}|${tone}`;
  const seed = hashSeed(seedStr);

  const dayPosts = buildDayPosts(parsed, tone, seed);
  const linkedInAngle = buildLinkedIn(parsed, tone, seed);
  const communityNote = buildCommunity(parsed, tone);
  const threadStarter = buildThread(parsed, tone, seed);
  const hashtags = buildHashtags(parsed, seed);
  const ctaVariants = buildCtas(parsed, tone, seed);
  const headline = buildHeadline(parsed, tone);

  return {
    productName: parsed.productName,
    headline,
    dayPosts,
    linkedInAngle,
    communityNote,
    threadStarter,
    hashtags,
    ctaVariants,
    generatedAt: new Date().toISOString(),
    seed: seed.toString(16),
  };
}

/** Markdown export of a full sprint pack */
export function packToMarkdown(pack: SprintPack): string {
  const days = pack.dayPosts
    .map(
      (d) => `### Day ${d.day} — ${d.theme}\n\n${d.xPost}`
    )
    .join("\n\n");

  return `# ${pack.productName} — 7-day launch sprint

> ${pack.headline}

## Day-by-day X posts

${days}

## LinkedIn angle

${pack.linkedInAngle}

## Reddit / IndieHackers note

${pack.communityNote}

## Thread starter

${pack.threadStarter}

## Hashtags

${pack.hashtags.join(" ")}

## CTA variants

${pack.ctaVariants.map((c, i) => `${i + 1}. ${c}`).join("\n")}

---
Generated with PostSprint · ${pack.generatedAt}
`;
}

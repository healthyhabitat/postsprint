import { describe, it, expect } from "vitest";
import {
  generateSprintPack,
  packToMarkdown,
  hashSeed,
  parseLaunch,
} from "./generator";
import type { SprintInput, SprintPack } from "./types";

const base: SprintInput = {
  changelog:
    "Shipped dark mode and keyboard shortcuts for PantryWeek. Fixed grocery list sync lag. Users can plan a week of meals without leaving the keyboard.",
  productName: "PantryWeek",
  audience: "busy parents",
  tone: "calm",
};

const hypeFixture: SprintInput = {
  changelog:
    "Launching AI comment drafts for LinkedIn. Founders can reply in seconds without sounding robotic. Includes tone presets and shortcut insert.",
  productName: "ReplyKit",
  audience: "B2B founders",
  tone: "hype",
};

const techFixture: SprintInput = {
  changelog:
    "- Added CSV export for invoices\n- Webhook retries with exponential backoff\n- Fixed timezone bug on recurring invoices",
  productName: "InvoiceOS",
  audience: "freelance developers",
  tone: "technical",
};

const META =
  /how to market|marketing kit|content calendar template|social media strategy|grow your following|engagement tips|posting schedule advice|meta marketing|swipe file of hooks only|generic launch playbook/i;

function blob(pack: SprintPack): string {
  return [
    pack.productName,
    pack.headline,
    pack.dayPosts.map((d) => d.xPost).join("\n"),
    pack.linkedInAngle,
    pack.communityNote,
    pack.threadStarter,
    pack.hashtags.join(" "),
    pack.ctaVariants.join("\n"),
  ].join("\n");
}

function assertAboutLaunch(pack: SprintPack, mustMention: RegExp) {
  const text = blob(pack);
  expect(text).not.toMatch(META);
  expect(text).toMatch(mustMention);
  expect(pack.dayPosts).toHaveLength(7);
  expect(pack.dayPosts.every((d) => d.day >= 1 && d.day <= 7)).toBe(true);
  expect(pack.hashtags.length).toBeGreaterThanOrEqual(3);
  expect(pack.ctaVariants.length).toBeGreaterThanOrEqual(3);
}

describe("hashSeed", () => {
  it("is deterministic", () => {
    expect(hashSeed("abc")).toBe(hashSeed("abc"));
    expect(hashSeed("abc")).not.toBe(hashSeed("abd"));
  });
});

describe("parseLaunch", () => {
  it("respects product name hint", () => {
    const p = parseLaunch(base.changelog, "PantryWeek", "busy parents");
    expect(p.productName).toBe("PantryWeek");
    expect(p.audience).toBe("busy parents");
    expect(p.bullets.length).toBeGreaterThanOrEqual(1);
  });

  it("splits bullet changelogs", () => {
    const p = parseLaunch(techFixture.changelog!, "InvoiceOS");
    expect(p.bullets.length).toBeGreaterThanOrEqual(2);
  });
});

describe("generateSprintPack", () => {
  it("returns a complete 7-day pack", () => {
    const pack = generateSprintPack(base);
    expect(pack.productName).toBe("PantryWeek");
    expect(pack.headline.toLowerCase()).toMatch(/pantryweek|dark|keyboard|meal/);
    expect(pack.dayPosts).toHaveLength(7);
    expect(pack.linkedInAngle.length).toBeGreaterThan(40);
    expect(pack.communityNote.length).toBeGreaterThan(40);
    expect(pack.threadStarter.length).toBeGreaterThan(40);
    expect(pack.hashtags.length).toBeGreaterThanOrEqual(3);
    expect(pack.ctaVariants.length).toBe(5);
    assertAboutLaunch(pack, /pantryweek|dark mode|keyboard|grocery/i);
  });

  it("is deterministic", () => {
    const a = generateSprintPack(base);
    const b = generateSprintPack(base);
    expect(a.seed).toBe(b.seed);
    expect(a.dayPosts.map((d) => d.xPost)).toEqual(
      b.dayPosts.map((d) => d.xPost)
    );
    expect(a.linkedInAngle).toBe(b.linkedInAngle);
  });

  it("sells THIS launch for hype tone", () => {
    const pack = generateSprintPack(hypeFixture);
    assertAboutLaunch(pack, /replykit|linkedin|comment|founder/i);
    expect(pack.dayPosts[0].xPost.length).toBeGreaterThan(20);
  });

  it("sells THIS launch for technical tone", () => {
    const pack = generateSprintPack(techFixture);
    assertAboutLaunch(pack, /invoiceos|csv|webhook|invoice/i);
  });

  it("throws on empty changelog", () => {
    expect(() =>
      generateSprintPack({ changelog: "ab", tone: "calm" })
    ).toThrow(/at least 3/);
  });

  it("varies by tone", () => {
    const calm = generateSprintPack({ ...base, tone: "calm" });
    const hype = generateSprintPack({ ...base, tone: "hype" });
    expect(calm.dayPosts[0].xPost).not.toBe(hype.dayPosts[0].xPost);
  });
});

describe("packToMarkdown", () => {
  it("includes all sections", () => {
    const pack = generateSprintPack(base);
    const md = packToMarkdown(pack);
    expect(md).toMatch(/# PantryWeek/);
    expect(md).toMatch(/Day 1/);
    expect(md).toMatch(/Day 7/);
    expect(md).toMatch(/LinkedIn/);
    expect(md).toMatch(/Hashtags/);
    expect(md).toMatch(/PostSprint/);
  });
});

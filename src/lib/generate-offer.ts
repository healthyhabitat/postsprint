import { generateSprintPack } from "./generator";
import type { SprintInput, SprintPack } from "./types";

/**
 * Generate a sprint pack. Uses deterministic engine always.
 * If OPENAI_API_KEY is set, optionally polish day-1 X post (best-effort).
 * Polish must still promote THIS launch — never PostSprint meta copy.
 */
export async function generateSprint(input: SprintInput): Promise<SprintPack> {
  const pack = generateSprintPack(input);
  const key = process.env.OPENAI_API_KEY;
  if (!key) return pack;

  try {
    const day1 = pack.dayPosts[0]?.xPost ?? "";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 220,
        messages: [
          {
            role: "system",
            content:
              "You polish a Day-1 launch post for X/Twitter about the USER's product update. Keep it ready-to-post, under 280 chars if possible, never mention PostSprint, marketing kits, or how to market. Return ONLY the improved post, no markdown fences.",
          },
          {
            role: "user",
            content: `Product: ${pack.productName}\nChangelog: ${input.changelog}\nAudience: ${input.audience ?? "the audience"}\nTone: ${input.tone}\nPost:\n${day1}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return pack;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const polished = data.choices?.[0]?.message?.content?.trim();
    if (polished && polished.length > 40 && pack.dayPosts[0]) {
      const dayPosts = pack.dayPosts.map((d, i) =>
        i === 0 ? { ...d, xPost: polished } : d
      );
      return { ...pack, dayPosts };
    }
  } catch {
    // graceful fallback
  }
  return pack;
}

import { NextResponse } from "next/server";
import { generateSprint } from "@/lib/generate-offer";
import { isUnlocked } from "@/lib/unlock";
import type { SprintInput, Tone } from "@/lib/types";

const TONES: Tone[] = ["hype", "calm", "technical"];

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<SprintInput>;
    const changelog = (body.changelog ?? "").trim();
    if (changelog.length < 3) {
      return NextResponse.json(
        { error: "Changelog / feature must be at least 3 characters." },
        { status: 400 }
      );
    }

    const tone = (TONES.includes(body.tone as Tone) ? body.tone : "calm") as Tone;

    const pack = await generateSprint({
      changelog,
      productName: body.productName?.trim() || undefined,
      audience: body.audience?.trim() || undefined,
      tone,
    });

    const unlocked = await isUnlocked();

    // Free preview: hide days 5–7, thread, and CTAs until unlock
    const publicPack = unlocked
      ? pack
      : {
          ...pack,
          dayPosts: pack.dayPosts.map((d) =>
            d.day >= 5 ? { ...d, xPost: "" } : d
          ),
          threadStarter: "",
          ctaVariants: [] as string[],
        };

    return NextResponse.json({ pack: publicPack, unlocked });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

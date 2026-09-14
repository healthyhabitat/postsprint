export type Tone = "hype" | "calm" | "technical";

export interface SprintInput {
  changelog: string;
  productName?: string;
  audience?: string;
  tone: Tone;
}

export interface DayPost {
  day: number;
  theme: string;
  xPost: string;
}

export interface SprintPack {
  productName: string;
  headline: string;
  dayPosts: DayPost[];
  linkedInAngle: string;
  communityNote: string;
  threadStarter: string;
  hashtags: string[];
  ctaVariants: string[];
  generatedAt: string;
  seed: string;
}

export interface GenerateResult {
  pack: SprintPack;
  unlocked: boolean;
}

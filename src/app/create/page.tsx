import { cookies } from "next/headers";
import { CreateApp } from "@/components/CreateApp";
import { UNLOCK_COOKIE, verifyUnlockToken } from "@/lib/unlock";

export const metadata = {
  title: "Create — PostSprint",
  description: "Generate your 7-day social launch sprint from a changelog or feature.",
};

export default async function CreatePage() {
  const jar = await cookies();
  const unlocked = await verifyUnlockToken(jar.get(UNLOCK_COOKIE)?.value);

  return <CreateApp initialUnlocked={unlocked} />;
}

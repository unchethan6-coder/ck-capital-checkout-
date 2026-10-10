import { BarChart3, Compass, FolderOpen, Gift, Landmark, LifeBuoy, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Keyed by collection slug; a collection added in Intercom falls back to the lifebuoy. */
const ICONS: Record<string, LucideIcon> = {
  "about-us": Compass,
  general: FolderOpen,
  "account-rules": BarChart3,
  "funded-accounts": Landmark,
  giveaways: Gift,
  affiliates: Users,
};

/** The glowing icon tile that heads a collection card and a collection page. */
export function CollectionIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = ICONS[slug] ?? LifeBuoy;
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-[76px] w-[76px] items-center justify-center rounded-2xl border border-white/15 bg-[#1B1440]/80 text-white shadow-[0_0_28px_rgba(137,76,239,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-sm",
        className
      )}
    >
      <Icon size={34} strokeWidth={2} className="drop-shadow-[0_0_8px_rgba(169,139,255,0.9)]" />
    </span>
  );
}

/** The lit band behind the icon: brand light falling from the top edge into the card. */
export const COLLECTION_GLOW =
  "radial-gradient(120% 90% at 50% 0%, rgba(137,76,239,0.95) 0%, rgba(112,58,215,0.55) 28%, rgba(56,30,120,0.25) 58%, transparent 82%)";

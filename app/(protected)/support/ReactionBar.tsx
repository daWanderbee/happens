"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faHandHoldingHeart,
  faHandsPraying,
  faFaceSmile,
  faDroplet,
} from "@fortawesome/free-solid-svg-icons";

type ReactionId = "SEE" | "NOT_ALONE" | "SPACE" | "LISTEN" | "HEAVY";

const reactionOptions: {
  type: ReactionId;
  icon: any;
  text: string;
}[] = [
  { type: "SEE", icon: faHeart, text: "I see you" },
  { type: "NOT_ALONE", icon: faHandHoldingHeart, text: "You're not alone" },
  { type: "SPACE", icon: faHandsPraying, text: "Holding space" },
  { type: "LISTEN", icon: faFaceSmile, text: "I'm listening" },
  { type: "HEAVY", icon: faDroplet, text: "This sounds heavy" },
];

export default function ReactionBar({ postId }: { postId: string }) {
  const [active, setActive] = useState<ReactionId | null>(null);
  const [tooltip, setTooltip] = useState<ReactionId | null>(null);
  const [loading, setLoading] = useState<ReactionId | null>(null);

  useEffect(() => {
    fetch(`/api/reactions?postId=${postId}`, { credentials: "include" })
      .then((r) => r.text())
      .then((text) => {
        if (!text) return;
        const data = JSON.parse(text);
        setActive(data.active ?? null);
      })
      .catch(() => {});
  }, [postId]);

  async function react(type: ReactionId) {
    setLoading(type);
    setActive(type);
    try {
      await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId, type }),
      });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-5 flex items-center justify-between gap-1">
      {reactionOptions.map((r) => {
        const isActive = active === r.type;
        const isHovered = tooltip === r.type;

        return (
          <div
            key={r.type}
            className="relative flex flex-col items-center"
            onMouseEnter={() => setTooltip(r.type)}
            onMouseLeave={() => setTooltip(null)}
          >
            {/* Tooltip */}
            <div
              className={cn(
                "absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap",
                "px-2.5 py-1 rounded-lg text-[11px] font-medium pointer-events-none",
                "transition-all duration-150",
                isHovered
                  ? "opacity-100 -translate-y-0"
                  : "opacity-0 translate-y-1",
                "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900",
                "shadow-md",
              )}
            >
              {r.text}
              {/* arrow */}
              <span className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-neutral-900 dark:border-t-white" />
            </div>

            {/* Icon button */}
            <button
              onClick={() => react(r.type)}
              disabled={loading !== null}
              className={cn(
                "h-11 w-11 lg:w-24 flex items-center justify-center rounded-2xl border transition-all duration-200 active:scale-90",
                isActive
                  ? "bg-[#5D51DA]/12 border-[#5D51DA]/35 text-[#5D51DA] scale-105 dark:bg-[#5D51DA]/25 dark:border-[#5D51DA]/50 dark:text-[#8B82E8]"
                  : cn(
                      "border-black/5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 hover:scale-110",
                      "dark:border-[hsl(193_31%_25%)] dark:text-foreground/40 dark:hover:bg-[hsl(193_31%_20%)] dark:hover:text-foreground/80",
                    ),
              )}
            >
              <FontAwesomeIcon
                icon={r.icon}
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isActive && "drop-shadow-sm",
                )}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}

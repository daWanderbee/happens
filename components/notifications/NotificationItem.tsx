"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCommentDots,
  faSeedling,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  n: {
    id: string;
    type: "REACTION" | "COMMENT" | "MILESTONE";
    isRead: boolean;
    createdAt: string;
  };
  onRead: () => void;
}

const config = {
  REACTION: {
    icon: faHeart,
    iconColor: "text-rose-400",
    bgColor: "bg-rose-400/10",
    borderColor: "border-rose-400/25",
    glowColor: "shadow-rose-500/10",
    label: "Someone sent you strength.",
  },
  COMMENT: {
    icon: faCommentDots,
    iconColor: "text-sky-400",
    bgColor: "bg-sky-400/10",
    borderColor: "border-sky-400/25",
    glowColor: "shadow-sky-500/10",
    label: "Someone left a supportive comment.",
  },
  MILESTONE: {
    icon: faSeedling,
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/25",
    glowColor: "shadow-emerald-500/10",
    label: "Your post is receiving support.",
  },
};

export function NotificationItem({ n, onRead }: Props) {
  const c = config[n.type];

  const timeAgo = (() => {
    const diff = Date.now() - new Date(n.createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  })();

  return (
    <div
      onClick={onRead}
      className={`
        group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl
        cursor-pointer border transition-all duration-200
        ${
          n.isRead
            ? "bg-muted/20 border-border/30 opacity-50 hover:opacity-70"
            : `${c.bgColor} ${c.borderColor} shadow-lg ${c.glowColor} hover:brightness-110`
        }
      `}
    >
      {/* Icon bubble */}
      <div
        className={`
          shrink-0 h-10 w-10 rounded-xl flex items-center justify-center
          ${n.isRead ? "bg-muted/40" : `${c.bgColor} border ${c.borderColor}`}
        `}
      >
        <FontAwesomeIcon
          icon={c.icon}
          className={`h-4 w-4 ${n.isRead ? "text-muted-foreground" : c.iconColor}`}
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            n.isRead ? "text-muted-foreground" : "text-foreground font-medium"
          }`}
        >
          {c.label}
        </p>
        <span className="text-xs text-muted-foreground/70 mt-0.5 block">
          {timeAgo}
        </span>
      </div>

      {/* Unread dot */}
      {!n.isRead && (
        <FontAwesomeIcon
          icon={faCircle}
          className={`shrink-0 h-2 w-2 ${c.iconColor}`}
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCommentDots,
  faCalendarDays,
  faChevronDown,
  faChevronUp,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

interface Response {
  id: string;
  content: string;
  createdAt: string;
}

interface Post {
  id: string;
  content: string;
  emotionTag?: string | null;
  createdAt: Date;
  reactions: { id: string }[];
  responses: Response[];
}

export function ProfilePostCard({ post }: { post: Post }) {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isLong = post.content.length > 240;
  const preview = isLong ? post.content.slice(0, 240) + "…" : post.content;

  return (
    <>
      {/* ═══════════════════════════════════════════
          CARD
      ═══════════════════════════════════════════ */}
      <div
        className={cn(
          "w-full rounded-3xl border shadow-sm transition-colors flex flex-col",
          "bg-neutral-50 border-black/5",
          "dark:bg-background dark:border-[hsl(193_31%_20%)]",
        )}
      >
        {/* ── POST CONTENT ─────────────────────────── */}
        <div
          className={cn(
            "mx-4 mt-4 rounded-2xl border transition-colors",
            "bg-white border-black/5",
            "dark:bg-[hsl(193_31%_15%)] dark:border-[hsl(193_31%_25%)]",
          )}
        >
          <div className="px-5 py-5">
            {post.emotionTag && (
              <span className="inline-block mb-3 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#5D51DA]/10 text-[#5D51DA] dark:bg-[#5D51DA]/20 dark:text-[#8B82E8]">
                {post.emotionTag}
              </span>
            )}

            <p className="text-[15.5px] leading-relaxed text-neutral-900 dark:text-foreground">
              {preview}
            </p>

            {isLong && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-2 text-[12px] font-medium text-[#5D51DA] dark:text-[#8B82E8] hover:underline underline-offset-2 transition"
              >
                Read more
              </button>
            )}
          </div>

          {/* Footer row */}
          <div
            className={cn(
              "px-5 py-3 border-t flex items-center justify-between",
              "border-black/5 dark:border-[hsl(193_31%_25%)]",
            )}
          >
            {/* Reaction + reply counts */}
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-rose-400">
                <FontAwesomeIcon icon={faHeart} className="h-3 w-3" />
                {post.reactions.length}
              </span>

              {/* Toggle replies */}
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors"
              >
                <FontAwesomeIcon icon={faCommentDots} className="h-3 w-3" />
                {post.responses.length}
                <FontAwesomeIcon
                  icon={open ? faChevronUp : faChevronDown}
                  className="h-2.5 w-2.5 ml-0.5"
                />
              </button>
            </div>

            {/* Date */}
            <span className="flex items-center gap-1 text-[11px] text-neutral-400 dark:text-foreground/40">
              <FontAwesomeIcon icon={faCalendarDays} className="h-3 w-3" />
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {/* ── REPLIES DRAWER ── */}
          {open && (
            <div
              className={cn(
                "px-5 pb-4 pt-3 border-t space-y-2",
                "border-black/5 dark:border-[hsl(193_31%_25%)]",
              )}
            >
              {post.responses.length === 0 ? (
                <p className="text-xs text-neutral-400 dark:text-foreground/40 text-center py-2">
                  No replies yet
                </p>
              ) : (
                post.responses.map((r) => (
                  <div
                    key={r.id}
                    className={cn(
                      "rounded-xl border px-3 py-2.5",
                      "bg-sky-50 border-sky-100",
                      "dark:bg-sky-400/5 dark:border-sky-400/15",
                    )}
                  >
                    <p className="text-xs leading-relaxed text-neutral-800 dark:text-foreground">
                      {r.content}
                    </p>
                    <span className="text-[10px] text-neutral-400 dark:text-foreground/40 mt-1 block">
                      {new Date(r.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="h-4" />
      </div>

      {/* ═══════════════════════════════════════════
          READ MORE MODAL
      ═══════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Sheet */}
          <div
            className={cn(
              "relative w-full sm:max-w-lg rounded-3xl border shadow-2xl flex flex-col",
              "bg-white border-black/5",
              "dark:bg-[hsl(193_31%_13%)] dark:border-[hsl(193_31%_22%)]",
              "max-h-[80vh]",
            )}
          >
            {/* Handle bar (mobile) */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="w-9 h-1 rounded-full bg-neutral-200 dark:bg-neutral-700" />
            </div>

            {/* Header */}
            <div
              className={cn(
                "flex items-center justify-between px-6 py-4 border-b",
                "border-black/5 dark:border-[hsl(193_31%_22%)]",
              )}
            >
              <div className="flex items-center gap-2">
                {post.emotionTag && (
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#5D51DA]/10 text-[#5D51DA] dark:bg-[#5D51DA]/20 dark:text-[#8B82E8]">
                    {post.emotionTag}
                  </span>
                )}
                <span className="text-[11px] text-neutral-400 dark:text-foreground/40">
                  Shared anonymously
                </span>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className={cn(
                  "h-8 w-8 flex items-center justify-center rounded-full transition",
                  "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700",
                  "dark:text-foreground/40 dark:hover:bg-[hsl(193_31%_20%)] dark:hover:text-foreground",
                )}
              >
                <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
              </button>
            </div>

            {/* Full content */}
            <div className="overflow-y-auto px-6 py-5">
              <p className="text-[15.5px] leading-relaxed whitespace-pre-wrap text-neutral-900 dark:text-foreground">
                {post.content}
              </p>
            </div>

            {/* Footer */}
            <div
              className={cn(
                "px-6 py-4 border-t",
                "border-black/5 dark:border-[hsl(193_31%_22%)]",
              )}
            >
              <button
                onClick={() => setShowModal(false)}
                className={cn(
                  "w-full py-2.5 rounded-2xl text-sm font-medium transition active:scale-95",
                  "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                  "dark:bg-[hsl(193_31%_20%)] dark:text-foreground/70 dark:hover:bg-[hsl(193_31%_24%)]",
                )}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

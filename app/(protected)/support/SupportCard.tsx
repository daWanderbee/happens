"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";
import ReactionBar from "./ReactionBar";

export default function SupportCard({ post }: any) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const isLong = post.content.length > 240;
  const preview = isLong ? post.content.slice(0, 240) + "…" : post.content;

  async function sendSupport() {
    if (!text.trim()) return;
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, content: text }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setText("");
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

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

          <div
            className={cn(
              "px-5 py-3 border-t flex items-center justify-between",
              "border-black/5 dark:border-[hsl(193_31%_25%)]",
            )}
          >
            <span className="text-[11px] text-neutral-400 dark:text-foreground/40">
              Shared anonymously
            </span>
            {post.responses?.length > 0 && (
              <span className="text-[11px] text-neutral-400 dark:text-foreground/40">
                {post.responses.length}{" "}
                {post.responses.length === 1 ? "person" : "people"} responded
              </span>
            )}
          </div>
        </div>

        {/* ── REACTIONS ──────────────────────────────── */}
        <div className="px-4">
          <ReactionBar postId={post.id} />
        </div>

        {/* ── SUPPORT INPUT ──────────────────────────── */}
        <div className="px-4 mt-5">
          <p className="text-[11px] font-medium text-neutral-400 dark:text-foreground/40 mb-3">
            Share what you've felt — not what they should do.
          </p>

          <div
            className={cn(
              "rounded-2xl border transition-colors",
              "bg-white border-black/5",
              "dark:bg-[hsl(193_31%_15%)] dark:border-[hsl(193_31%_25%)]",
            )}
          >
            <div className="px-5 pt-4 pb-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write something supportive…"
                maxLength={400}
                rows={3}
                className={cn(
                  "w-full resize-none bg-transparent outline-none",
                  "text-[14.5px] leading-relaxed",
                  "text-neutral-900 placeholder:text-neutral-300",
                  "dark:text-foreground dark:placeholder:text-foreground/30",
                )}
              />
            </div>

            <div
              className={cn(
                "px-5 py-3 flex items-center justify-between border-t",
                "border-black/5 dark:border-[hsl(193_31%_25%)]",
              )}
            >
              <span className="text-[11px] text-neutral-400 dark:text-foreground/40">
                {sent ? "✓ Support sent" : `${text.length}/400`}
              </span>

              <button
                onClick={sendSupport}
                disabled={!text.trim() || loading}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition active:scale-95",
                  text.trim() && !loading
                    ? "bg-[#5D51DA] text-white hover:bg-[#5D51DA]/90"
                    : cn(
                        "bg-neutral-100 text-neutral-400 cursor-not-allowed",
                        "dark:bg-[hsl(193_31%_22%)] dark:text-foreground/40",
                      ),
                )}
              >
                {loading ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    className="h-3.5 w-3.5"
                  />
                ) : (
                  <FontAwesomeIcon icon={faHeart} className="h-3.5 w-3.5" />
                )}
                {loading ? "Sending…" : "Send"}
              </button>
            </div>

            {error && (
              <div className="px-5 pb-3 text-xs text-red-500">{error}</div>
            )}
          </div>
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

            {/* Full content — scrollable only inside modal */}
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

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function SharePage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleShare() {
    if (!content.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setContent(""); // clear composer
      router.refresh(); // refresh to show the new post
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full ">
      {/* OUTER CARD */}
      <section
        className={cn(
          "mx-auto w-full min-h-screen max-w-3xl rounded-t-3xl p-6 shadow-sm transition-colors",
          "bg-neutral-50 border border-black/5",
          "dark:bg-[hsl(193_31%_10%)] dark:border-[hsl(193_31%_20%)]",
        )}
      >
        {/* INNER CARD */}
        <div
          className={cn(
            "rounded-2xl border transition-colors",
            "bg-white border-black/5",
            "dark:bg-background dark:border-[hsl(193_31%_25%)]",
          )}
        >
          {/* TEXTAREA */}
          <div className="px-6 py-6">
            <textarea
              value={content}
              maxLength={500}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share something you’ve been holding in…"
              className={cn(
                "w-full min-h-[180px] resize-none bg-transparent outline-none",
                "text-[16px] leading-relaxed",
                "text-neutral-900 placeholder:text-neutral-400",
                "dark:text-foreground dark:placeholder:text-foreground/40",
              )}
            />

            <div className="mt-2 text-right text-xs text-neutral-400 dark:text-foreground/40">
              {content.length}/500
            </div>
          </div>

          {/* ACTION BAR */}
          <div
            className={cn(
              "px-6 py-4 flex items-center justify-between",
              "border-t border-black/5 dark:border-[hsl(193_31%_25%)]",
            )}
          >
            <span className="text-xs text-neutral-500 dark:text-foreground/50">
              This will be shared anonymously.
            </span>

            <button
              onClick={handleShare}
              disabled={!content.trim() || loading}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition active:scale-95",
                content.trim() && !loading
                  ? "bg-[#5D51DA] text-white hover:bg-[#5D51DA]/90"
                  : cn(
                      "bg-neutral-100 text-neutral-400 cursor-not-allowed",
                      "dark:bg-[hsl(193_31%_22%)] dark:text-foreground/40",
                    ),
              )}
            >
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <FontAwesomeIcon icon={faShare} className="h-4 w-4" />
              )}
              {loading ? "Sharing…" : "Share"}
            </button>
          </div>

          {error && (
            <div className="px-6 pb-4 text-sm text-red-500">{error}</div>
          )}
        </div>
      </section>
    </div>
  );
}

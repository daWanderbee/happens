"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function SupportForm({ postId }: { postId: string }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function sendSupport() {
    if (!text.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/support-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: text }),
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
    <div
      className={cn(
        "rounded-2xl border transition-colors mt-4",
        "bg-white border-black/5",
        "dark:bg-[hsl(193_31%_15%)] dark:border-[hsl(193_31%_25%)]",
      )}
    >
      {/* TEXTAREA */}
      <div className="px-5 py-5">
        <p className="text-xs text-neutral-400 dark:text-foreground/40 mb-3">
          Share what you've felt, not what they should do.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your experience if it feels right…"
          maxLength={400}
          className={cn(
            "w-full min-h-[100px] resize-none bg-transparent outline-none",
            "text-[15px] leading-relaxed",
            "text-neutral-900 placeholder:text-neutral-400",
            "dark:text-foreground dark:placeholder:text-foreground/40",
          )}
        />
        <div className="mt-1 text-right text-xs text-neutral-400 dark:text-foreground/40">
          {text.length}/400
        </div>
      </div>

      {/* ACTION BAR */}
      <div
        className={cn(
          "px-5 py-4 flex items-center justify-between",
          "border-t border-black/5 dark:border-[hsl(193_31%_25%)]",
        )}
      >
        <span className="text-xs text-neutral-500 dark:text-foreground/50">
          {sent ? "✓ Support sent" : "Shared anonymously"}
        </span>

        <button
          onClick={sendSupport}
          disabled={!text.trim() || loading}
          className={cn(
            "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition active:scale-95",
            text.trim() && !loading
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
            <FontAwesomeIcon icon={faHeart} className="h-4 w-4" />
          )}
          {loading ? "Sending…" : "Send Support"}
        </button>
      </div>

      {error && <div className="px-5 pb-4 text-sm text-red-500">{error}</div>}
    </div>
  );
}

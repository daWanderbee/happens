"use client";

import { useState, useRef, useEffect } from "react";
import SupportCard from "./SupportCard";

const GHOST_CONFIGS = [
  { rotate: -5, translateX: -16, translateY: 10, scale: 0.97 },
  { rotate: 4, translateX: 13, translateY: 16, scale: 0.94 },
  { rotate: -9, translateX: -6, translateY: 22, scale: 0.91 },
  { rotate: 6, translateX: 20, translateY: 28, scale: 0.88 },
];

/* Ghost cards always follow the app theme class (.dark on <html>),
   not the OS preference. Colors are deliberately muted so they never
   overpower the active card. */
const GHOST_BG_LIGHT = ["#faf9ff", "#f7fbfb", "#fdfaf8", "#f8f7ff"];
const GHOST_BORDER_LIGHT = ["#ebe9fb", "#daeef0", "#f0e8e2", "#e8e6fa"];
const GHOST_BG_DARK = [
  "hsl(247,28%,17%)",
  "hsl(193,28%,14%)",
  "hsl(19,18%,14%)",
  "hsl(247,24%,13%)",
];
const GHOST_BORDER_DARK = [
  "hsl(247,28%,26%)",
  "hsl(193,28%,22%)",
  "hsl(19,18%,22%)",
  "hsl(247,24%,21%)",
];
const GHOST_LINES = [76, 52, 66, 38];

export default function SupportDeck({ posts }: any) {
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragRotate, setDragRotate] = useState(0);
  const [exiting, setExiting] = useState<"left" | "right" | null>(null);
  const [isDark, setIsDark] = useState(false);

  const startX = useRef<number | null>(null);
  const isDragging = useRef(false);

  /* Watch the .dark class on <html> — correct for Tailwind class-based dark mode */
  useEffect(() => {
    const html = document.documentElement;
    const check = () => setIsDark(html.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  function handleStart(clientX: number) {
    startX.current = clientX;
    isDragging.current = true;
  }

  function handleMove(clientX: number) {
    if (!isDragging.current || startX.current === null) return;
    const diff = clientX - startX.current;
    setDragOffset(diff);
    setDragRotate(diff * 0.05);
  }

  function handleEnd() {
    if (!isDragging.current) return;
    if (dragOffset < -90 && index < posts.length - 1) triggerExit("left");
    else if (dragOffset > 90 && index > 0) triggerExit("right");
    else {
      setDragOffset(0);
      setDragRotate(0);
    }
    isDragging.current = false;
    startX.current = null;
  }

  function triggerExit(dir: "left" | "right") {
    setExiting(dir);
    setTimeout(() => {
      setIndex((prev) => (dir === "left" ? prev + 1 : prev - 1));
      setDragOffset(0);
      setDragRotate(0);
      setExiting(null);
    }, 300);
  }

  function goTo(i: number) {
    if (i !== index) triggerExit(i > index ? "left" : "right");
  }

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-neutral-400">
        Nothing to show right now.
      </div>
    );
  }

  const currentPost = posts[index];
  const ghostCount = Math.min(posts.length - 1 - index, GHOST_CONFIGS.length);
  const isDraggingNow = Math.abs(dragOffset) > 10;

  const exitTransform =
    exiting === "left"
      ? "translateX(-145%) rotate(-20deg)"
      : exiting === "right"
        ? "translateX(145%) rotate(20deg)"
        : null;

  const topTransform =
    exitTransform ?? `translateX(${dragOffset}px) rotate(${dragRotate}deg)`;

  return (
    <div className="flex overflow-x-clip flex-col items-center gap-6 w-full max-w-xl">
      {/* ── DECK STAGE ── */}
      <div
        className="relative w-full select-none cursor-grab active:cursor-grabbing"
        style={{ paddingTop: "2.5rem", paddingBottom: "2rem" }}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        {/* GHOST CARDS — rendered furthest-back first */}
        {Array.from({ length: ghostCount })
          .map((_, gi) => ghostCount - 1 - gi)
          .map((gi) => {
            const cfg = GHOST_CONFIGS[gi];
            const bg = isDark ? GHOST_BG_DARK[gi] : GHOST_BG_LIGHT[gi];
            const bc = isDark ? GHOST_BORDER_DARK[gi] : GHOST_BORDER_LIGHT[gi];
            return (
              <div
                key={`ghost-${index}-${gi}`}
                className="absolute inset-x-0 rounded-3xl border pointer-events-none transition-all duration-500 ease-out"
                style={{
                  top: 0,
                  bottom: 0,
                  zIndex: gi + 1,
                  backgroundColor: bg,
                  borderColor: bc,
                  transform: `translateX(${cfg.translateX}px) translateY(${cfg.translateY}px) rotate(${cfg.rotate}deg) scale(${cfg.scale})`,
                  transformOrigin: "bottom center",
                }}
              >
                {/* Faint ruled-line hint at content */}
                <div
                  className="absolute inset-x-5 top-7 space-y-2.5"
                  style={{ opacity: isDark ? 0.12 : 0.18 }}
                >
                  {GHOST_LINES.map((w, li) => (
                    <div
                      key={li}
                      className="rounded-full"
                      style={{
                        height: "6px",
                        width: `${w}%`,
                        backgroundColor: isDark ? "#fff" : "#1a1a2e",
                      }}
                    />
                  ))}
                </div>
                {/* Corner pips */}
                <div
                  className="absolute top-4 left-5 text-[10px]"
                  style={{
                    opacity: isDark ? 0.15 : 0.22,
                    color: isDark ? "#fff" : "#1a1a2e",
                  }}
                >
                  ♡
                </div>
                <div
                  className="absolute bottom-4 right-5 text-[10px] rotate-180"
                  style={{
                    opacity: isDark ? 0.15 : 0.22,
                    color: isDark ? "#fff" : "#1a1a2e",
                  }}
                >
                  ♡
                </div>
              </div>
            );
          })}

        {/* ACTIVE CARD */}
        <div
          className="relative"
          style={{
            zIndex: 20,
            transform: topTransform,
            transition: exiting
              ? "transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s"
              : isDragging.current
                ? "none"
                : "transform 0.42s cubic-bezier(0.34,1.4,0.64,1)",
            opacity: exiting ? 0 : 1,
            transformOrigin: "bottom center",
            filter: isDraggingNow
              ? "drop-shadow(0 22px 44px rgba(93,81,218,0.18))"
              : "drop-shadow(0 4px 18px rgba(30,30,60,0.07))",
          }}
        >
          <SupportCard key={currentPost.id} post={currentPost} />
        </div>

        {/* SWIPE CHEVRONS */}
        {index < posts.length - 1 && (
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 pointer-events-none"
            style={{
              opacity: Math.max(0, (-dragOffset - 30) / 80),
              color: "hsl(var(--primary))",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        )}
        {index > 0 && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 pointer-events-none"
            style={{
              opacity: Math.max(0, (dragOffset - 30) / 80),
              color: "hsl(var(--primary))",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </div>
        )}
      </div>

      {/* ── PROGRESS ── */}
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex items-center gap-2">
          {posts.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === index ? "22px" : "7px",
                height: "7px",
                backgroundColor:
                  i === index
                    ? "hsl(var(--primary))"
                    : i < index
                      ? "hsl(var(--primary) / 0.28)"
                      : isDark
                        ? "hsl(var(--border))"
                        : "#d1d5db",
              }}
            />
          ))}
        </div>
        <p
          className="text-[11px] tabular-nums"
          style={{
            color: isDark ? "rgba(255,255,255,0.3)" : "rgba(30,30,60,0.35)",
          }}
        >
          {index + 1} of {posts.length} · drag to swipe
        </p>
      </div>
    </div>
  );
}

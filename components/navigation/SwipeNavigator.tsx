"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type Screen = "home" | "share";

export default function SwipeNavigator({
  home,
  share,
}: {
  home: React.ReactNode;
  share: React.ReactNode;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);

  const [offsetX, setOffsetX] = useState(0);
  const [screen, setScreen] = useState<Screen>("home");
  const [dragging, setDragging] = useState(false);
  const [width, setWidth] = useState(0);

  // ✅ Measure ACTUAL viewport width (not window)
  useEffect(() => {
    if (!viewportRef.current) return;

    const measure = () => {
      setWidth(viewportRef.current!.getBoundingClientRect().width);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  function onStart(e: React.TouchEvent | React.MouseEvent) {
    setDragging(true);
    startX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  }

  function onMove(e: React.TouchEvent | React.MouseEvent) {
    if (!dragging) return;
    const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setOffsetX(currentX - startX.current);
  }

  function onEnd() {
    setDragging(false);

    if (offsetX < -width / 3) setScreen("share");
    if (offsetX > width / 3) setScreen("home");

    setOffsetX(0);
  }

  return (
    <div
      ref={viewportRef}
      className="relative h-full overflow-hidden"
      onTouchStart={onStart}
      onTouchMove={onMove}
      onTouchEnd={onEnd}
      onMouseDown={onStart}
      onMouseMove={onMove}
      onMouseUp={onEnd}
      onMouseLeave={onEnd}
    >
      {/* SWIPE TRACK */}
      <div
        className={cn(
          "flex h-full transition-transform duration-300 ease-out",
          dragging && "transition-none",
        )}
        style={{
          transform: `translateX(${
            screen === "home" ? offsetX : -width + offsetX
          }px)`,
        }}
      >
        <div className="w-full shrink-0">{home}</div>
        <div className="w-full shrink-0">{share}</div>
      </div>
    </div>
  );
}

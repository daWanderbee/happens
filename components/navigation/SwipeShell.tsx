"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
// import DynamicIsland from "./DynamicIsland";

type Screen = "home" | "share";

export default function SwipeShell({
  home,
  share,
}: {
  home: React.ReactNode;
  share: React.ReactNode;
}) {
  const startX = useRef(0);
  const [offsetX, setOffsetX] = useState(0);
  const [screen, setScreen] = useState<Screen>("home");
  const [dragging, setDragging] = useState(false);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    setWidth(window.innerWidth);
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

    if (offsetX < -120) setScreen("share");
    if (offsetX > 120) setScreen("home");

    setOffsetX(0);
  }

  if (width === null) return null;

  return (
    <>
      {/* 🔹 DYNAMIC ISLAND — DERIVED FROM SCREEN */}
      {/* <DynamicIsland>
        {screen === "home" && (
          <span className="text-sm font-medium">Reading</span>
        )}
        {screen === "share" && (
          <span className="text-sm font-medium">Share something</span>
        )}
      </DynamicIsland> */}

      {/* 🔹 SWIPE SCREENS */}
      <div
        className="relative overflow-hidden h-full"
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
        onMouseDown={onStart}
        onMouseMove={onMove}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
      >
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
    </>
  );
}

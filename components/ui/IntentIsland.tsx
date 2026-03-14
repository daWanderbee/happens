"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faPenToSquare,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

const actions = [
  { label: "Read", icon: faBookOpen, path: "/home" },
  { label: "Share", icon: faPenToSquare, path: "/share" },
  { label: "Support", icon: faHeart, path: "/support" },
];

export default function IntentIsland() {
  const pathname = usePathname();
  const router = useRouter();
  const [pulse, setPulse] = useState(false);
  

  const activeIndex = actions.findIndex((item) => item.path === pathname);

  if (activeIndex === -1) return null;

  function handleClick(path: string) {
    setPulse(true);
    router.push(path);
    setTimeout(() => setPulse(false), 280);
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-40",
        pulse && "animate-pulse-once",
      )}
    >
      {/* ISLAND */}
      <div className="relative w-[69vw] max-w-[420px] rounded-full bg-[#5D51DA] text-white shadow-2xl px-4 py-4">
        {/* INNER TRACK */}
        <div className="relative flex items-center">
          {/* SLIDING ACTIVE PILL */}
          <div
            className="absolute  py-7 rounded-full bg-white/20 animate-glow transition-transform duration-300"
            style={{
              width: "33.3333%",
              transform: `translateX(${activeIndex * 100}%)`,
            }}
          />

          {/* ACTION BUTTONS */}
          {actions.map((item) => {
            const active = pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleClick(item.path)}
                className={cn(
                  "relative z-10 flex w-1/3 items-center justify-center gap-3 py-4 rounded-full",
                  "text-sm font-medium transition-opacity",
                  active ? "opacity-100" : "opacity-80 hover:opacity-100",
                )}
              >
                <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

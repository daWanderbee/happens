"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function Overlay({
  open,
  onClick,
}: {
  open: boolean;
  onClick?: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[0] bg-black/40 pointer-events-auto"
      onClick={onClick}
    />,
    document.body,
  );
}

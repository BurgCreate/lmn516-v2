"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PageTransitionReset() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.remove(
      "page-leaving"
    );
  }, [pathname]);

  return null;
}
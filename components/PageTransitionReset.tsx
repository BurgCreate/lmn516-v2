"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PageTransitionReset() {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;

    html.classList.remove("page-leaving");
    html.classList.add("page-entering");

    const timer = window.setTimeout(() => {
      html.classList.remove("page-entering");
    }, 550);

    return () => {
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
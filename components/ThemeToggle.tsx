"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("lmn516-theme");
    const isDark = savedTheme === "dark";

    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );

    document.body.classList.toggle("dark", isDark);

    setDark(isDark);
  }, []);

  function toggleTheme() {
    const nextDark = !dark;

    setDark(nextDark);

    document.documentElement.setAttribute(
      "data-theme",
      nextDark ? "dark" : "light"
    );

    document.body.classList.toggle("dark", nextDark);

    localStorage.setItem(
      "lmn516-theme",
      nextDark ? "dark" : "light"
    );
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "切换到浅色模式" : "切换到深色模式"}
      title={dark ? "切换到浅色模式" : "切换到深色模式"}
    >
      {dark ? "☀︎" : "◐"}
    </button>
  );
}
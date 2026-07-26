"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lmn516-theme");

    if (saved === "dark") {
      document.body.classList.add("dark");
      setDark(true);
    }
  }, []);

  function toggleTheme() {
    const next = !dark;

    setDark(next);

    document.body.classList.toggle("dark", next);

    localStorage.setItem(
      "lmn516-theme",
      next ? "dark" : "light"
    );
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      type="button"
    >
      {dark ? "☀︎" : "◐"}
    </button>
  );
}
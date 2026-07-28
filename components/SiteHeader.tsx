"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

type SiteHeaderProps = {
  className?: string;
};

const navigationItems = [
  { label: "本期", hash: "notes" },
  { label: "专题", hash: "project" },
  { label: "收藏", hash: "archive" },
  { label: "关于", hash: "about" }
];

export default function SiteHeader({ className = "" }: SiteHeaderProps) {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");
  const isHome = pathname === "/";

  useEffect(() => {
    function syncHash() {
      setActiveHash(window.location.hash.replace("#", ""));
    }

    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  return (
    <header className={`site-header shell${className ? ` ${className}` : ""}`}>
      <Link href="/" className="brand" aria-label="LMN516 首页">
        LMN516
      </Link>

      <nav className="nav" aria-label="网站导航">
        {navigationItems.map((item) => {
          const href = isHome ? `#${item.hash}` : `/#${item.hash}`;
          const isCurrent = isHome && activeHash === item.hash;

          return (
            <Link
              href={href}
              key={item.hash}
              className={isCurrent ? "nav-link is-current" : "nav-link"}
              aria-current={isCurrent ? "location" : undefined}
            >
              {item.label}
            </Link>
          );
        })}

        <Link
          href="/changelog"
          className={pathname === "/changelog" ? "nav-link is-current" : "nav-link"}
          aria-current={pathname === "/changelog" ? "page" : undefined}
        >
          生长记录
        </Link>
      </nav>

      <ThemeToggle />
    </header>
  );
}

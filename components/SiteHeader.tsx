"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import GardenNotification from "@/components/GardenNotification";
import { GardenBrandSprig } from "@/components/garden";

type SiteHeaderProps = {
  className?: string;
};

type HashNavigationItem = {
  label: string;
  hash: string;
  href?: never;
};

type PageNavigationItem = {
  label: string;
  href: string;
  hash?: never;
};

type NavigationItem =
  | HashNavigationItem
  | PageNavigationItem;

const navigationItems: NavigationItem[] = [
  { label: "首页", href: "/" },
  { label: "文章", href: "/posts" },
  { label: "档案", href: "/archive" },
  { label: "碎碎念", href: "/moments" },
  { label: "音乐", href: "/music" },
  { label: "关于", href: "/about" },
];

export default function SiteHeader({
  className = "",
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    function syncHash() {
      setActiveHash(
        window.location.hash.replace("#", "")
      );
    }

    syncHash();

    window.addEventListener(
      "hashchange",
      syncHash
    );

    return () => {
      window.removeEventListener(
        "hashchange",
        syncHash
      );
    };
  }, [pathname]);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(false);
      return;
    }

    function syncScrollState() {
      setIsScrolled(window.scrollY > 8);
    }

    syncScrollState();
    window.addEventListener("scroll", syncScrollState, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        "scroll",
        syncScrollState
      );
    };
  }, [isHome]);

  return (
    <header
      className={`site-header shell${
        isHome ? " site-header-sticky" : ""
      }${
        isScrolled ? " is-scrolled" : ""
      }${className ? ` ${className}` : ""}`}
    >
      <Link
        href="/"
        className="brand"
        aria-label="LMN516 首页"
      >
        <GardenBrandSprig className="brand-sprig" />
        <span className="brand-wordmark">LMN516</span>
        <span className="brand-subtitle">Digital Garden</span>
      </Link>

      <nav
        className="nav"
        aria-label="网站导航"
      >
        {navigationItems.map((item) => {
          const href =
            item.href !== undefined
              ? item.href
              : isHome
                ? `#${item.hash}`
                : `/#${item.hash}`;

          const isCurrent =
            item.href !== undefined
              ? pathname === item.href
              : isHome &&
                activeHash === item.hash;

          return (
            <Link
              key={
                item.href !== undefined
                  ? item.href
                  : item.hash
              }
              href={href}
              className={
                isCurrent
                  ? "nav-link is-current"
                  : "nav-link"
              }
              aria-current={
                isCurrent
                  ? item.href !== undefined
                    ? "page"
                    : "location"
                  : undefined
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="site-header-actions">
        <GardenNotification />
        <ThemeToggle />
      </div>
    </header>
  );
}
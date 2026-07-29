"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import GardenNotification from "@/components/GardenNotification";
import InstallPrompt from "@/components/InstallPrompt";

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
  { label: "本期", hash: "notes" },
  { label: "专题", hash: "project" },
  { label: "收藏", hash: "archive" },
  { label: "照片墙", href: "/photos" },
  { label: "关于", hash: "about" },
];

export default function SiteHeader({
  className = "",
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");

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

  return (
    <header
      className={`site-header shell${
        className ? ` ${className}` : ""
      }`}
    >
      <Link
        href="/"
        className="brand"
        aria-label="LMN516 首页"
      >
        LMN516
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

        <Link
          href="/changelog"
          className={
            pathname === "/changelog"
              ? "nav-link is-current"
              : "nav-link"
          }
          aria-current={
            pathname === "/changelog"
              ? "page"
              : undefined
          }
        >
          生长记录
        </Link>
      </nav>

      <div className="site-header-actions">
        <InstallPrompt />
        <GardenNotification />
        <ThemeToggle />
      </div>
    </header>
  );
}
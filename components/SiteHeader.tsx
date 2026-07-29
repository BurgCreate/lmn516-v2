"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import GardenNotification from "@/components/GardenNotification";

type SiteHeaderProps = {
  className?: string;
};

const navigationItems = [
  { label: "文章", href: "/archive" },
  { label: "碎碎念", href: "/moments" },
  { label: "音乐墙", href: "/music" },
  { label: "照片墙", href: "/photos" },
];

export default function SiteHeader({
  className = "",
}: SiteHeaderProps) {
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
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="nav-link"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="site-header-actions">
        <GardenNotification />
        <ThemeToggle />
      </div>
    </header>
  );
}

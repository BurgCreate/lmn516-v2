"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import GardenNotification from "@/components/GardenNotification";

const links = [
  { label: "首页", href: "/" },
  { label: "文章", href: "/posts" },
  { label: "档案", href: "/archive" },
  { label: "碎碎念", href: "/moments" },
  { label: "音乐", href: "/music" },
  { label: "关于", href: "/about" },
];

export default function SiteHeader({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <header className={`site-header ${className}`.trim()}>
      <Link href="/" className="brand" aria-label="LMN516 首页">
        <span className="brand-wordmark">LMN516</span>
        <span className="brand-sprout" aria-hidden="true">♧</span>
        <span className="brand-subtitle">Digital Garden</span>
      </Link>

      <nav className="nav" aria-label="网站导航">
        {links.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={`nav-link${active ? " is-current" : ""}`}>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="site-header-actions">
        <GardenNotification />
        <ThemeToggle />
        <button type="button" className="v3-menu-button" aria-label="打开菜单"><span /><span /><span /></button>
      </div>
    </header>
  );
}

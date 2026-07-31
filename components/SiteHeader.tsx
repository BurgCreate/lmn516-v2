"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

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
          return <Link key={item.href} href={item.href} className={`nav-link${active ? " is-current" : ""}`}>{item.label}</Link>;
        })}
      </nav>

      <div className="site-header-actions">
        <Link href="/pwa-test" className="v3-bell-button" aria-label="通知设置" title="通知设置">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
        </Link>
        <ThemeToggle />
        <button type="button" className="v3-menu-button" aria-label="打开菜单"><span /><span /><span /></button>
      </div>
    </header>
  );
}

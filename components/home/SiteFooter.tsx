import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer shell">
      <span>© 2025–2026 LMN516</span>
      <span>一本持续更新的个人生活杂志。</span>
      <Link href="/changelog" className="footer-version">
        当前版本 · V2.1
      </Link>
    </footer>
  );
}

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

type ChangeGroup = {
  title: string;
  tone: "new" | "improved" | "fixed" | "rebuilt";
  items: string[];
};

type Release = {
  version: string;
  date: string;
  title: string;
  summary: string;
  current?: boolean;
  groups: ChangeGroup[];
};

const releases: Release[] = [
  {
    version: "V2.1",
    date: "2026.07.28",
    title: "让首页更完整，也更像一座数字花园",
    summary:
      "这一版集中整理首页体验，让照片、文章、导航与时间信息更自然地待在一起。",
    current: true,
    groups: [
      {
        title: "新增",
        tone: "new",
        items: ["精选随机照片机制", "手机端导航菜单", "网站生长记录页面"],
      },
      {
        title: "优化",
        tone: "improved",
        items: [
          "横版照片完整显示，减少不必要的裁切",
          "碎碎念气泡在手机端尽量保持单行",
          "首页展示最近 4 篇文章",
          "日期与时间信息增加分钟级刷新",
          "电脑端文字阅读体验",
        ],
      },
      {
        title: "修复",
        tone: "fixed",
        items: ["部分导航按钮无法点击", "页面切换后滚动位置没有重置"],
      },
    ],
  },
  {
    version: "V2.0",
    date: "2026.07.26",
    title: "从博客模板走向独立前端",
    summary:
      "网站完成前后端分离。WordPress 继续负责内容，Next.js 负责呈现，GitHub 与 Vercel 接管版本和部署。",
    groups: [
      {
        title: "重构",
        tone: "rebuilt",
        items: [
          "采用 WordPress Headless + Next.js 架构",
          "接入 GitHub 版本管理与 Vercel 自动部署",
          "建立文章详情、归档、音乐与关于页面",
        ],
      },
      {
        title: "新增",
        tone: "new",
        items: [
          "深色模式",
          "随机照片墙",
          "今日档案与年度进度",
          "一万个俯卧撑动态进度",
          "最近更新与生活档案",
          "碎碎念气泡",
        ],
      },
    ],
  },
  {
    version: "V1.0",
    date: "2026.01",
    title: "WordPress 博客正式上线",
    summary:
      "LMN516 开始成为一个真正属于自己的写作空间，文章、照片和生活记录有了固定住所。",
    groups: [
      {
        title: "起点",
        tone: "new",
        items: ["完成域名与服务器配置", "安装并启用 WordPress", "开始持续发布个人文章"],
      },
    ],
  },
];

export const metadata = {
  title: "生长记录 | LMN516",
  description: "LMN516 的版本更新与网站成长记录。",
};

export default function ChangelogPage() {
  return (
    <main id="top" className="changelog-page">
      <div className="paper-noise" aria-hidden="true" />

      <header className="site-header shell">
        <Link href="/" className="brand" aria-label="LMN516 首页">
          LMN516
        </Link>

        <nav className="nav" aria-label="网站导航">
          <Link href="/">首页</Link>
          <Link href="/archive">文章</Link>
          <Link href="/music">音乐</Link>
          <Link href="/about">关于</Link>
        </nav>

        <ThemeToggle />
      </header>

      <section className="changelog-hero shell">
        <div>
          <p className="eyebrow">Growth Log</p>
          <h1>生长记录</h1>
          <p className="changelog-intro">
            LMN516 一直在慢慢生长。这里记录每一次调整、修复和重新思考，也记录它如何一点点变成今天的样子。
          </p>
        </div>

        <aside className="current-version-card" aria-label="当前版本">
          <span>当前版本</span>
          <strong>V2.1</strong>
          <small>更新于 2026.07.28</small>
        </aside>
      </section>

      <section className="release-timeline shell" aria-label="版本记录">
        {releases.map((release) => (
          <article className="release-entry" key={release.version}>
            <div className="release-marker" aria-hidden="true">
              <span />
            </div>

            <div className="release-card">
              <header className="release-header">
                <div>
                  <div className="release-version-row">
                    <h2>{release.version}</h2>
                    {release.current && <span className="current-badge">当前版本</span>}
                  </div>
                  <p className="release-date">{release.date}</p>
                </div>
              </header>

              <h3>{release.title}</h3>
              <p className="release-summary">{release.summary}</p>

              <div className="change-groups">
                {release.groups.map((group) => (
                  <section className="change-group" key={group.title}>
                    <h4 className={`change-label change-label-${group.tone}`}>
                      {group.title}
                    </h4>
                    <ul>
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <footer className="site-footer shell">
        <span>© 2025–2026 LMN516</span>
        <Link href="/">返回首页</Link>
      </footer>
    </main>
  );
}

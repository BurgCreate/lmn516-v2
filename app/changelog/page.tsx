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
    title: "进入持续打磨阶段",
    summary:
      "继续调整首页图片、移动端体验、导航与页面比例，并新增生长记录，让网站的变化本身也被保存下来。",
    current: true,
    groups: [
      {
        title: "新增",
        tone: "new",
        items: ["生长记录页面", "精选随机照片机制", "移动端导航入口"],
      },
      {
        title: "优化",
        tone: "improved",
        items: [
          "调整首页照片展示比例",
          "首页展示最近 4 篇文章",
          "优化碎碎念与移动端排版",
          "统一全站标题与正文的字号层级",
        ],
      },
      {
        title: "修复",
        tone: "fixed",
        items: ["部分导航入口无法点击", "页面切换后滚动位置未重置"],
      },
    ],
  },
  {
    version: "V2.0",
    date: "2026.07.26",
    title: "新版首页与主要功能集中完成",
    summary:
      "在完成迁移后的第二天，网站开始真正形成现在的样子。首页、文章系统、生活档案和互动功能被逐步补齐。",
    groups: [
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
      {
        title: "完善",
        tone: "improved",
        items: [
          "文章详情页与全部文章页面",
          "音乐、关于等独立页面",
          "WordPress 内容与首页图片连接",
          "GitHub 推送后由 Vercel 自动部署",
        ],
      },
    ],
  },
  {
    version: "V1.5",
    date: "2026.07.25",
    title: "开始迁移到 Next.js",
    summary:
      "从传统 WordPress 模板迁移到 WordPress Headless + Next.js。WordPress 继续保存内容，新的前端开始接管网站的设计与交互。",
    groups: [
      {
        title: "重构",
        tone: "rebuilt",
        items: [
          "建立 Next.js 前端项目",
          "通过 REST API 读取 WordPress 内容",
          "接入 GitHub 版本管理",
          "接入 Vercel 自动构建与部署",
        ],
      },
    ],
  },
  {
    version: "V1.0",
    date: "2026.01",
    title: "个人网站正式上线",
    summary:
      "以第一篇文章发布为起点，LMN516 正式成为一个属于自己的写作与生活记录空间。",
    groups: [
      {
        title: "起点",
        tone: "new",
        items: [
          "完成域名、服务器与 WordPress 配置",
          "发布第一篇文章",
          "开始保存文章、照片与生活记录",
        ],
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
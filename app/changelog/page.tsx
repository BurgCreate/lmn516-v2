import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

type ReleaseTone = "new" | "improved" | "fixed" | "rebuilt";

type ReleaseGroup = {
  title: string;
  tone: ReleaseTone;
  items: string[];
};

type Release = {
  version: string;
  date: string;
  title: string;
  summary: string;
  current?: boolean;
  groups: ReleaseGroup[];
};

const releases: Release[] = [
  {
    version: "V2.1",
    date: "2026.07.28 · 星期二",
    title: "从页面打磨到完整设计系统",
    summary:
      "这一天，LMN516 不只是继续调整页面细节，而是建立了一套覆盖字体、间距、布局、卡片、按钮、导航、动效与夜间模式的 UI Design System。同时新增生长记录与照片页面，并将庞大的全局样式和首页代码拆分为更清晰、可维护的模块。",
    current: true,
    groups: [
      {
        title: "新增",
        tone: "new",
        items: [
          "新增「生长记录」页面，用于保存网站每个阶段的真实更新",
          "在首页加入生长记录入口",
          "新增独立照片页面与照片画廊组件",
          "接入网站访问统计",
        ],
      },
      {
        title: "UI Design System",
        tone: "rebuilt",
        items: [
          "Phase 1：建立统一的字体与字号层级，系统整理标题、正文和辅助文字",
          "Phase 2：建立统一的间距系统，规范页面留白、区块距离、卡片内边距与网格间隔",
          "Phase 3：建立响应式容器系统，统一宽屏、常规页面、阅读页、窄页面和生长记录页面宽度",
          "Phase 4：建立卡片系统，统一圆角、背景、边框、阴影及交互反馈",
          "Phase 5：建立按钮与控件系统，统一高度、内边距、圆角、焦点、禁用状态及深色状态",
          "Phase 6：建立共享导航系统，将首页与生长记录页面统一为可复用的 SiteHeader 组件",
          "Phase 7：建立动效系统，统一卡片、按钮、导航、照片、主题切换和页面退出动画节奏",
          "Phase 8：重构夜间视觉语言，完成覆盖全站的深蓝色夜间模式",
        ],
      },
      {
        title: "照片体验",
        tone: "improved",
        items: [
          "建立精选随机照片机制，不再从全部媒体图片中完全随机抽取",
          "调整首页照片墙的筛选、轮换和展示逻辑",
          "将电脑端首页横版照片调整为更适合照片内容的 4:3 比例",
          "分别优化电脑端和手机端的照片显示方式，减少不必要的放大与裁切",
          "修复照片页面样式遗漏及导航类型问题",
        ],
      },
      {
        title: "阅读与响应式",
        tone: "improved",
        items: [
          "系统调整首页、文章页和独立页面在手机端的字号层级",
          "缩小手机端「一万个俯卧撑」与「一个人的网站，应该像他的房间」等过大标题",
          "统一手机端栏目标题、文章标题、正文和辅助文字比例",
          "完善文章标题、链接、引用、代码、表格、图片与说明文字在夜间模式下的阅读效果",
          "增加高对比度偏好和减少动态效果支持",
        ],
      },
      {
        title: "代码重构",
        tone: "rebuilt",
        items: [
          "将超过五千行的 globals.css 拆分为 16 个按职责划分的样式文件",
          "新增样式目录说明，明确设计令牌、基础样式、首页、内容、移动端、夜间模式和照片等模块",
          "将首页拆分为 Hero、持续进行、最近更新、生活档案、关于本站和页脚等可复用组件",
          "显著缩短 app/page.tsx，使首页结构更清晰并便于后续维护",
        ],
      },
      {
        title: "修复",
        tone: "fixed",
        items: [
          "修复部分手机端标题过大、视觉层级失衡的问题",
          "修复部分移动端样式未命中真实页面元素的问题",
          "修复电脑端与手机端首页照片比例显示不一致的问题",
          "修复 SiteHeader 在不同页面导航数据结构下的类型问题",
        ],
      },
    ],
  },
  {
    version: "V2.0",
    date: "2026.07.26 · 星期日",
    title: "新版网站的主要功能成形",
    summary:
      "在完成 WordPress 与 Next.js 的连接后，网站的首页、文章系统、生活档案、照片展示和互动功能在这一天集中完成。LMN516 不再只是一个新的页面外观，而开始成为一个能够自动读取内容、实时变化并持续扩展的个人网站。",
    groups: [
      {
        title: "内容连接",
        tone: "rebuilt",
        items: [
          "完善 WordPress REST API 数据读取",
          "从 WordPress 自动读取文章标题、日期、摘要和正文",
          "从 WordPress 自动读取文章特色图片",
          "建立文章数据的备用内容机制，避免接口异常时页面完全空白",
          "修正 WordPress API 地址和内容请求路径",
          "处理 WordPress 摘要中的 HTML、空格和省略号问题",
        ],
      },
      {
        title: "文章系统",
        tone: "new",
        items: [
          "完成单篇文章动态页面",
          "完成全部文章列表页面",
          "根据文章 slug 自动生成文章访问路径",
          "首页文章卡片可以真正进入对应文章",
          "增加文章标题、摘要、日期与特色图片展示",
          "建立「继续阅读」和「查看全部文章」入口",
        ],
      },
      {
        title: "自动数据",
        tone: "new",
        items: [
          "首页自动显示当天日期和星期",
          "自动计算并显示当年的时间进度",
          "自动读取最近更新的文章",
          "从 WordPress 文章标题中提取俯卧撑完成数量",
          "让「一万个俯卧撑」进度随着文章标题更新而自动变化",
          "建立俯卧撑目标、当前数量和进度条展示",
        ],
      },
      {
        title: "首页重构",
        tone: "rebuilt",
        items: [
          "重组首页信息结构，形成杂志式个人主页",
          "建立今日档案、持续进行、最近更新、生活档案和关于本站等区域",
          "用真实照片替代原先较为抽象的首页视觉区",
          "增加文章特色图片组成的内容卡片",
          "移除图片周围多余的色块和边框",
          "调整首页空间、留白、标题和正文层级",
          "统一中文栏目名称，减少不必要的英文标签",
        ],
      },
      {
        title: "照片与生活档案",
        tone: "new",
        items: [
          "连接 WordPress 媒体库",
          "新增随机照片墙组件",
          "让首页照片能够按照间隔自动切换",
          "将照片切换时间调整为 12 秒",
          "新增音乐、散步、房间和电影等生活档案页面",
          "为未来的 Digital Garden 页面结构建立基础",
        ],
      },
      {
        title: "碎碎念",
        tone: "new",
        items: [
          "新增碎碎念数据读取功能",
          "新增碎碎念独立页面",
          "新增首页右下角碎碎念气泡",
          "为气泡加入点击互动效果",
          "调整气泡尺寸、形状和动画幅度",
          "解决气泡过大、动画眩晕以及滚动时位置不自然的问题",
          "增加从首页气泡进入碎碎念页面的过渡效果",
        ],
      },
      {
        title: "主题与交互",
        tone: "new",
        items: [
          "新增浅色与深色模式切换",
          "建立 ThemeToggle 独立组件",
          "让主题选择能够在页面刷新后继续保留",
          "增加页面切换动画",
          "增加页面跳转后的滚动位置重置",
          "让首页的部分卡片和按钮从装饰元素变成真实链接",
        ],
      },
      {
        title: "视觉调整",
        tone: "improved",
        items: [
          "保留宣纸雾白、墨色文字和青黛强调色的视觉方向",
          "尝试 Apple 风格后恢复更适合 LMN516 的原始气质",
          "尝试杂志式首页结构并继续调整",
          "统一 LOGO 为一行显示的「LMN516」",
          "整理并精简 globals.css 中重复和冲突的样式",
          "调整电脑端与手机端不同页面的标题大小",
        ],
      },
    ],
  },
  {
    version: "V1.5",
    date: "2026.07.25 · 星期六",
    title: "从 WordPress 网站走向前后端分离",
    summary:
      "这一天正式建立 lmn516-v2 项目。在 AI 协作下，原本由 WordPress 主题同时负责内容和页面的网站，被拆分成独立的内容后台与前端界面。WordPress 继续保存文章和图片，Next.js 开始接管页面、设计和交互。",
    groups: [
      {
        title: "架构重建",
        tone: "rebuilt",
        items: [
          "建立独立的 Next.js 前端项目",
          "采用 Next.js App Router 组织页面",
          "将 WordPress 从完整网站调整为 Headless CMS",
          "保留 WordPress 作为文章、图片和生活记录的数据后台",
          "建立 Next.js 与 WordPress REST API 之间的数据连接",
          "将网站前端与内容管理系统正式分离",
        ],
      },
      {
        title: "开发基础",
        tone: "new",
        items: [
          "建立 app、components 和 lib 等基础目录",
          "建立首页、文章页、归档页和关于页面",
          "创建 WordPress 数据读取文件",
          "建立文章的数据类型与获取函数",
          "配置 TypeScript 路径别名",
          "配置 WordPress 图片域名访问权限",
          "升级和调整 Next.js 项目依赖",
        ],
      },
      {
        title: "版本管理",
        tone: "new",
        items: [
          "创建 GitHub 项目仓库",
          "开始使用 Git 保存每一次网站修改",
          "建立 main 分支作为正式部署版本",
          "形成 git add、git commit、git push 的更新流程",
          "可以通过 GitHub 查看和恢复网站历史版本",
        ],
      },
      {
        title: "自动部署",
        tone: "new",
        items: [
          "将 GitHub 仓库连接到 Vercel",
          "建立 GitHub 推送后自动构建和部署的流程",
          "让 lmn516.com 指向新的 Next.js 前端",
          "保留 cms.lmn516.com 作为 WordPress 内容后台",
          "继续通过 Cloudflare 管理域名解析",
        ],
      },
      {
        title: "设计探索",
        tone: "improved",
        items: [
          "将最初的基础页面转换为 LMN516 的个人视觉设计",
          "多次尝试并比较不同首页布局",
          "在现代网页风格和原有个人气质之间寻找平衡",
          "恢复并保留更符合个人网站氛围的颜色、字体和留白",
          "确定网站不只是博客，而是逐渐发展为 Digital Garden",
        ],
      },
      {
        title: "解决的问题",
        tone: "fixed",
        items: [
          "修复项目路径别名无法识别的问题",
          "修复 WordPress API 地址配置错误",
          "修复前端无法正确读取 WordPress 文章的问题",
          "解决本地代码、GitHub 与 Vercel 部署版本不同步的问题",
          "验证无痕模式和正式域名下的更新结果",
        ],
      },
    ],
  },
  {
    version: "V1.0",
    date: "2026.01",
    title: "WordPress 阶段：个人网站正式建立",
    summary:
      "在自己的 VPS 上完成服务器和 WordPress 配置后，LMN516 成为一个可以正式写文章、上传照片和保存生活记录的个人网站。这一阶段解决了「拥有网站」的问题，也为后来的前后端分离保留了全部内容基础。",
    groups: [
      {
        title: "服务器",
        tone: "rebuilt",
        items: [
          "使用自己的 VPS 承载网站",
          "在 Ubuntu 服务器上配置 Nginx",
          "安装并配置 PHP、MariaDB 和 WordPress",
          "配置 HTTPS 与网站访问规则",
          "建立属于自己的 WordPress 数据库",
        ],
      },
      {
        title: "网站上线",
        tone: "new",
        items: [
          "完成 lmn516.com 域名配置",
          "通过 Cloudflare 管理 DNS",
          "使用 WordPress 主题搭建网站页面",
          "开始发布个人文章",
          "建立 WordPress 媒体库",
          "开始保存照片、随笔和生活记录",
        ],
      },
      {
        title: "阶段局限",
        tone: "improved",
        items: [
          "网站内容可以稳定发布，但页面结构受 WordPress 主题限制",
          "首页样式较为固定，难以按照个人想法自由调整",
          "文章、图片与页面展示紧密绑定在同一套 WordPress 主题中",
          "逐渐产生自行设计首页和增加更多互动功能的需求",
        ],
      },
    ],
  },
  {
    version: "V0.5",
    date: "2025–2026",
    title: "从一个网页开始",
    summary:
      "在使用 WordPress 之前，LMN516 曾经历静态网页和 Hugo 等不同形式。这个阶段的网站功能并不复杂，但域名、服务器和个人内容已经逐渐聚到一起，网站开始真正成为一个长期项目。",
    groups: [
      {
        title: "早期尝试",
        tone: "new",
        items: [
          "购买并使用 lmn516.com 域名",
          "购买 VPS 并学习通过 SSH 管理服务器",
          "尝试使用静态 HTML 和 Nginx 发布网页",
          "尝试使用 Hugo 与 PaperMod 搭建博客",
          "逐渐明确网站用于保存文章、照片和个人经历",
        ],
      },
    ],
  },
];

const toneLabels: Record<ReleaseTone, string> = {
  new: "新增",
  improved: "优化",
  fixed: "修复",
  rebuilt: "重构",
};

export default function ChangelogPage() {
  return (
    <main className="changelog-page">
      <SiteHeader className="changelog-site-header" />

      <section className="changelog-hero shell">
        <p className="changelog-eyebrow">生长记录</p>
        <h1>一个网站，如何慢慢长成自己的样子。</h1>
        <p className="changelog-intro">
          LMN516 并不是一开始就是现在的样子。它从一个简单网页开始，经历了静态博客、
          WordPress，再到今天的 WordPress Headless + Next.js。这里记录的不只是功能更新，
          也是我在 AI 的协作下学习网站开发、不断尝试、做出选择，并把它变成自己真正喜欢的样子的过程。
        </p>
      </section>

      <section className="changelog-timeline shell" aria-label="LMN516 版本记录">
        {releases.map((release) => (
          <article
            className={`release-card${release.current ? " release-card-current" : ""}`}
            key={`${release.version}-${release.date}`}
          >
            <div className="release-meta">
              <div className="release-version-row">
                <span className="release-version">{release.version}</span>
                {release.current ? <span className="release-current">当前版本</span> : null}
              </div>
              <time>{release.date}</time>
            </div>

            <div className="release-content">
              <h2>{release.title}</h2>
              <p className="release-summary">{release.summary}</p>

              <div className="release-groups">
                {release.groups.map((group) => (
                  <section className="release-group" key={`${release.version}-${group.title}`}>
                    <div className="release-group-heading">
                      <span className={`release-dot release-dot-${group.tone}`} aria-hidden="true" />
                      <h3>{group.title}</h3>
                      <span className="release-tone-label">{toneLabels[group.tone]}</span>
                    </div>

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

      <footer className="changelog-footer shell">
        <p>代码会继续变化，内容会继续增加，生活也不会乖乖停在一个版本里。</p>
        <Link href="/">回到 LMN516</Link>
      </footer>

      <style>{`
        .changelog-page {
          min-height: 100vh;
          color: var(--text);
          background: var(--bg);
        }

        .changelog-page .shell {
          width: min(1120px, calc(100% - 48px));
          margin-inline: auto;
        }

        .changelog-header {
          min-height: 88px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid var(--line);
        }

        .changelog-brand {
          color: inherit;
          font-family: Inter, system-ui, sans-serif;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-decoration: none;
        }

        .changelog-header-actions {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .changelog-back-link {
          min-height: var(--control-height-sm);
          display: inline-flex;
          align-items: center;
          color: var(--muted);
          font-family: var(--font-sans);
          font-size: var(--text-body-sm);
          text-decoration: none;
          transition:
            color var(--control-transition),
            transform var(--control-transition),
            opacity var(--control-transition);
        }

        .changelog-back-link:hover {
          color: var(--text);
          transform: translateX(-3px);
        }

        .changelog-back-link:active {
          transform: translateX(-1px);
          opacity: 0.72;
        }

        .changelog-hero {
          padding-top: clamp(72px, 10vw, 132px);
          padding-bottom: clamp(70px, 9vw, 118px);
        }

        .changelog-eyebrow {
          margin: 0 0 22px;
          color: var(--accent);
          font-family: Inter, system-ui, sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.22em;
        }

        .changelog-hero h1 {
          max-width: 850px;
          margin: 0;
          font-size: clamp(42px, 6.3vw, 78px);
          font-weight: 500;
          line-height: 1.16;
          letter-spacing: -0.045em;
          text-wrap: balance;
        }

        .changelog-intro {
          max-width: 760px;
          margin: 38px 0 0;
          color: var(--muted);
          font-size: 17px;
          line-height: 2;
        }

        .changelog-timeline {
          padding-bottom: 112px;
        }

        .release-card {
          display: grid;
          grid-template-columns: minmax(150px, 0.28fr) minmax(0, 1fr);
          gap: clamp(40px, 7vw, 96px);
          padding: clamp(48px, 6vw, 76px) 0;
          border-top: 1px solid var(--line);
        }

        .release-card-current {
          position: relative;
        }

        .release-card-current::before {
          content: "";
          position: absolute;
          top: -1px;
          left: 0;
          width: 92px;
          height: 2px;
          background: var(--accent);
        }

        .release-meta {
          position: sticky;
          top: 30px;
          align-self: start;
        }

        .release-version-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .release-version {
          font-family: Inter, system-ui, sans-serif;
          font-size: 18px;
          font-weight: 750;
          letter-spacing: -0.02em;
        }

        .release-current {
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          padding: 3px 9px;
          border: 1px solid color-mix(in srgb, var(--accent) 38%, transparent);
          border-radius: 999px;
          color: var(--accent);
          background: color-mix(in srgb, var(--accent-soft) 74%, transparent);
          font-family: Inter, system-ui, sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .release-meta time {
          display: block;
          margin-top: 12px;
          color: var(--muted);
          font-family: Inter, system-ui, sans-serif;
          font-size: 12px;
          line-height: 1.6;
        }

        .release-content h2 {
          max-width: 720px;
          margin: 0;
          font-size: clamp(30px, 4vw, 48px);
          font-weight: 500;
          line-height: 1.28;
          letter-spacing: -0.035em;
        }

        .release-summary {
          max-width: 760px;
          margin: 24px 0 0;
          color: var(--muted);
          font-size: 16px;
          line-height: 1.95;
        }

        .release-groups {
          display: grid;
          gap: 42px;
          margin-top: 48px;
        }

        .release-group {
          max-width: 780px;
        }

        .release-group-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .release-group-heading h3 {
          margin: 0;
          font-family: Inter, system-ui, sans-serif;
          font-size: 14px;
          font-weight: 750;
          letter-spacing: 0.02em;
        }

        .release-tone-label {
          color: var(--muted);
          font-family: Inter, system-ui, sans-serif;
          font-size: 10px;
          letter-spacing: 0.1em;
        }

        .release-dot {
          width: 8px;
          height: 8px;
          flex: 0 0 auto;
          border-radius: 999px;
          background: var(--muted);
        }

        .release-dot-new {
          background: var(--accent);
        }

        .release-dot-improved {
          background: #8f7046;
        }

        .release-dot-fixed {
          background: #8a5a58;
        }

        .release-dot-rebuilt {
          background: #596d86;
        }

        .release-group ul {
          display: grid;
          gap: 11px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .release-group li {
          position: relative;
          padding-left: 20px;
          color: var(--text);
          font-size: 15px;
          line-height: 1.8;
        }

        .release-group li::before {
          content: "";
          position: absolute;
          top: 0.86em;
          left: 1px;
          width: 5px;
          height: 1px;
          background: var(--muted);
        }

        .changelog-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          padding-top: 44px;
          padding-bottom: 58px;
          border-top: 1px solid var(--line);
        }

        .changelog-footer p {
          margin: 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.7;
        }

        .changelog-footer a {
          flex: 0 0 auto;
          color: var(--link-color);
          font-family: var(--font-sans);
          font-size: var(--text-meta);
          font-weight: 700;
          text-decoration-line: underline;
          text-decoration-color: var(--link-underline);
          text-decoration-thickness: 1px;
          text-underline-offset: 0.28em;
          transition:
            color var(--control-transition),
            text-decoration-color var(--control-transition),
            opacity var(--control-transition);
        }

        .changelog-footer a:hover {
          text-decoration-color: var(--link-underline-hover);
        }

        .changelog-footer a:active {
          opacity: 0.7;
        }

        @media (max-width: 720px) {
          .changelog-page .shell {
            width: 100%;
          }

          .changelog-header {
            min-height: 72px;
          }

          .changelog-back-link {
            display: none;
          }

          .changelog-hero {
            padding-top: 62px;
            padding-bottom: 72px;
          }

          .changelog-hero h1 {
            font-size: clamp(34px, 10.6vw, 48px);
            line-height: 1.22;
          }

          .changelog-intro {
            margin-top: 28px;
            font-size: 15px;
            line-height: 1.9;
          }

          .release-card {
            grid-template-columns: 1fr;
            gap: 28px;
            padding: 54px 0;
          }

          .release-meta {
            position: static;
          }

          .release-content h2 {
            font-size: 29px;
            line-height: 1.32;
          }

          .release-summary {
            margin-top: 20px;
            font-size: 15px;
            line-height: 1.9;
          }

          .release-groups {
            gap: 34px;
            margin-top: 38px;
          }

          .release-group li {
            font-size: 14px;
            line-height: 1.75;
          }

          .changelog-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 520px) {
          .changelog-hero h1 {
            font-size: 32px;
          }

          .release-content h2 {
            font-size: 26px;
          }
        }
      `}</style>
    </main>
  );
}
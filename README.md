# LMN516 v2

这是一个已经接好 WordPress REST API 的 Next.js 前端。

## 它会怎么工作

- 你仍然在原来的 WordPress 后台写文章
- 新网站会通过 `https://lmn516.com/wp-json/wp/v2/posts` 自动读取文章
- 首页、归档页和文章页会自动更新
- 当前 WordPress 主题不再决定访客看到的样子

## 最省事的上线方式

### 1. 上传到 GitHub

新建一个仓库，例如 `lmn516-v2`，把这个文件夹里的全部文件上传进去。

### 2. 导入 Vercel

登录 Vercel，选择 `Add New Project`，导入刚才的 GitHub 仓库。

环境变量填写：

- `WORDPRESS_URL` = `https://lmn516.com`
- `NEXT_PUBLIC_SITE_URL` = `https://lmn516.com`

然后点击 Deploy。

### 3. 先使用测试网址

Vercel 会生成一个类似：

`lmn516-v2.vercel.app`

先检查文章、图片、手机端和所有页面。

### 4. 最后再绑定正式域名

测试通过后，才把 `lmn516.com` 绑定到 Vercel。

注意：正式切换时，WordPress 最好改到子域名，例如：

`cms.lmn516.com`

否则同一个根域名不能同时既指向新版前端，又继续直接承载旧 WordPress。正式切换前必须先备份数据库和 `wp-content/uploads`。

## 本地预览

安装 Node.js 后运行：

```bash
npm install
npm run dev
```

浏览器打开：

`http://localhost:3000`

## LMN516 UI Design System v1.0

### Phase 2 - Spacing System

- Added an 11-step spacing scale from 4px to 120px.
- Added semantic spacing roles for page gutters, page rhythm, sections, cards and grids.
- Unified key spacing across the homepage, archive, article, subpages and footer.
- Added responsive spacing roles at 720px and 520px without changing component structure.

## UI Design System v1.0 - Phase 3

- Added shared container tokens for wide, page, reading, narrow, and changelog layouts.
- Standardized responsive breakpoints around 960px, 720px, and 520px.
- Unified shell, archive, article, subpage, moments, and changelog widths.
- Preserved existing mobile typography and component-specific visual behavior.

## UI Design System v1.0 - Phase 4

- Added shared card tokens for radius, surfaces, borders, shadows and interaction timing.
- Unified Today, Progress, Post, Archive and empty-state card styling.
- Added consistent hover, focus-visible and reduced-motion behavior.
- Moved dark card styling onto shared variables instead of component-by-component values.
- Preserved list and timeline layouts that are not semantically cards.

## UI Design System v1.0 - Phase 5

- Added shared control height, padding, radius, focus-ring, motion, and color tokens.
- Unified primary and ghost buttons across hover, active, focus, disabled, mobile, and dark states.
- Standardized text links, back links, theme toggle controls, and special interactive focus states.
- Preserved the unique behavior of the photo wall and moment bubble while giving them common accessibility feedback.


## UI Design System v1.0 - Phase 6

- Added shared navigation tokens for header height, link color, spacing, indicators, and mobile navigation surfaces.
- Replaced separate homepage and Change Log headers with one reusable `SiteHeader` component.
- Added current-page and current-section states with `aria-current` support.
- Unified desktop navigation, mobile horizontal navigation, logo behavior, theme-toggle alignment, focus, active, and reduced-motion behavior.
- Preserved lightweight back links on reading and utility pages instead of forcing the full site header onto every page.

## UI Design System v1.0 - Phase 7

- Added shared motion duration and easing tokens.
- Unified card, control, navigation, photo, theme, and page-exit timing.
- Preserved expressive motion for the photo wall and moment bubble while reducing inconsistent one-off timings.
- Added comprehensive `prefers-reduced-motion` behavior, including immediate moment-page navigation.


## UI Design System v1.0 - Phase 8

- Audited dark-theme background, surface, border, text, accent, shadow, button, link and navigation tokens.
- Unified dark card hierarchy across homepage, archive, moments and changelog surfaces.
- Improved article readability for headings, links, blockquotes, inline code, code blocks, tables, captions, rules and images.
- Improved dark-theme treatment for the random photo area, controls, forms, navigation and changelog interactions.
- Preserved all existing layout, content, responsive and animation behavior.

## UI Design System v1.0 - Phase 8 Redesign

Phase 8 was rebuilt as **LMN516 Night Language** rather than a conventional dark-theme audit.

- Replaced the green-tinted dark palette with a calm, warm-neutral gray system.
- Introduced explicit night background, surface, text, border, accent, code, and overlay tokens.
- Reduced card and component shadows to near-zero and moved hierarchy into surface contrast.
- Unified navigation, buttons, cards, article content, forms, changelog, photo presentation, and the moment bubble.
- Preserved existing layout, typography sizing, component dimensions, and motion behavior.
- Borrowed the restraint of modern reading interfaces without copying ChatGPT's layout or component identity.

## UI Design System v1.0 - Phase 9

### Night Surface System

- Added semantic Night surface roles: canvas, section, card, interactive, floating, and inset.
- Replaced ad-hoc dark backgrounds with a consistent elevation hierarchy.
- Kept ordinary content cards close to the page canvas and reserved stronger contrast for controls and floating UI.
- Reduced reliance on shadows; most hierarchy now comes from restrained neutral-gray steps and subtle separators.
- Preserved the existing layout, typography, component dimensions, motion, and application logic.

## LMN516 Night Final

This release completes the site's dark-mode system in one pass.

- Replaced the charcoal-only night palette with a calm developer-tool-inspired dark navy system.
- Added complete dark-mode coverage for the homepage, archive, posts index, moments, music, movies, walks, room, about, and changelog pages.
- Added dedicated long-form WordPress article styling for headings, paragraphs, links, lists, quotes, inline code, code blocks, tables, images, captions, marks, keyboard keys, and dividers.
- Unified navigation, controls, forms, cards, floating UI, mobile navigation, focus states, scrollbars, and photo presentation.
- Preserved all layouts, type sizes, component dimensions, application logic, WordPress data access, and existing motion behavior.
- Added a higher-contrast preference override for users who request stronger contrast.

## Owner Push（站长新留言通知）

Vercel 需要配置：

```env
LMN516_OWNER_SETUP_SECRET=仅站长知道的设备绑定密码
LMN516_PUSH_API_SECRET=与 WordPress 插件一致的内部接口密钥
NEXT_PUBLIC_VAPID_PUBLIC_KEY=Web Push 公钥
VAPID_PRIVATE_KEY=Web Push 私钥
VAPID_SUBJECT=mailto:hello@lmn516.com
LMN516_OWNER_INBOX_URL=https://cms.lmn516.com/wp-admin/admin.php?page=lmn516-garden-mailbox
```

部署后在需要收通知的手机上访问 `/admin/push`，输入 `LMN516_OWNER_SETUP_SECRET` 完成绑定。

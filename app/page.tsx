import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import {
  getPosts,
  getPostById,
} from "@/lib/wordpress";

export const revalidate = 300;


/**
 * 获取今天的日期与星期。
 */
function getTodayInfo() {
  const now = new Date();

  return {
    date: `${String(now.getMonth() + 1).padStart(2, "0")}.${String(
      now.getDate()
    ).padStart(2, "0")}`,

    fullDate: `${now.getFullYear()}.${String(
      now.getMonth() + 1
    ).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`,

    weekday: now.toLocaleDateString("zh-CN", {
      weekday: "long",
    }),
  };
}


/**
 * 获取当前年份已经过去的百分比。
 */
function getYearProgress() {
  const now = new Date();

  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear() + 1, 0, 1);

  const progress =
    ((now.getTime() - start.getTime()) /
      (end.getTime() - start.getTime())) *
    100;

  return progress.toFixed(1);
}


/**
 * 清理 WordPress 返回的摘要。
 */
function cleanExcerpt(excerpt?: string | null) {
  return (excerpt ?? "")
    .replace(/\[&hellip;\]/g, "")
    .replace(/&hellip;/g, "…")
    .trim();
}


/**
 * 将日期统一显示为 YYYY.MM.DD。
 */
function formatPostDate(date?: string | null) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return `${parsedDate.getFullYear()}.${String(
    parsedDate.getMonth() + 1
  ).padStart(2, "0")}.${String(parsedDate.getDate()).padStart(2, "0")}`;
}


/**
 * 获取月份与日期，作为无封面文章的视觉文字。
 */
function formatShortDate(date?: string | null) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return `${String(parsedDate.getMonth() + 1).padStart(2, "0")}
${String(parsedDate.getDate()).padStart(2, "0")}`;
}


export default async function HomePage() {
  const posts = await getPosts(4);

  const featured = posts[0];
  const cards = posts.slice(1, 4);

  const pushupPost = await getPostById(347);

  const pushupMatch = pushupPost?.title.match(
    /已完成\s*([\d,]+)\s*个/
  );

  const pushups = pushupMatch
    ? Number(pushupMatch[1].replace(/,/g, ""))
    : 0;

  const target = 10000;

  const pushupProgress =
    target > 0
      ? ((pushups / target) * 100).toFixed(2)
      : "0.00";

  const remaining = Math.max(target - pushups, 0);

  const today = getTodayInfo();
  const yearProgress = getYearProgress();


  return (
    <main id="top">
      <div
        className="paper-noise"
        aria-hidden="true"
      />


      {/* 顶部导航 */}
      <header className="site-header shell">
        <Link
          href="/"
          className="brand"
          aria-label="LMN516 首页"
        >
          <span className="brand-mark">
            LMN
          </span>

          <span className="brand-number">
            516
          </span>
        </Link>


        <nav
          className="nav"
          aria-label="网站导航"
        >
          <a href="#notes">
            本期
          </a>

          <a href="#project">
            专题
          </a>

          <a href="#archive">
            收藏
          </a>

          <a href="#about">
            关于
          </a>
        </nav>


        <ThemeToggle />
      </header>



      {/* 卷首 */}
      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">
            今日片段
          </p>


          <h1>
            把普通日子，
            <br />
            认真存档。
          </h1>


          <p className="intro">
            这里是 Mo 的个人生活杂志。
            记录周记、旅行、影像、音乐，
            以及一些看起来没什么用、
            但多年以后一定会很珍贵的事情。
          </p>


          <div className="hero-actions">
            <a
              className="button primary"
              href="#notes"
            >
              阅读本期
            </a>

            <a
              className="button ghost"
              href="#archive"
            >
              翻阅收藏
            </a>
          </div>
        </div>



        {/* 今日档案卡片 */}
        <aside className="today-card">
          <p className="card-label">
            今日档案
          </p>


          <div className="date-block">
            <strong>
              {today.date}
            </strong>

            <span>
              {today.weekday} · 盛夏
            </span>
          </div>


          <dl>
            <div>
              <dt>
                年度进度
              </dt>

              <dd>
                {yearProgress}%
              </dd>
            </div>


            <div>
              <dt>
                本期封面
              </dt>

              <dd>
                {featured?.title ?? "尚未更新"}
              </dd>
            </div>


            <div>
              <dt>
                俯卧撑
              </dt>

              <dd>
                {pushups.toLocaleString("zh-CN")} /{" "}
                {target.toLocaleString("zh-CN")}
              </dd>
            </div>
          </dl>
        </aside>
      </section>



      {/* 长期专题 */}
      <section
        id="project"
        className="project shell section-space"
      >
        <div className="project-copy">
          <p className="eyebrow">
            持续进行
          </p>


          <h2>
            一万个俯卧撑
          </h2>


          <p>
            开始于 2026 年 2 月 16 日。
            没有宏大的宣言，
            只有一天一天如实记录。
          </p>


          {pushupPost && (
            <Link
              className="text-link"
              href={`/posts/${pushupPost.slug}`}
            >
              阅读专题记录 →
            </Link>
          )}
        </div>



        <div className="progress-panel">
          <div className="progress-number">
            <strong>
              {pushups.toLocaleString("zh-CN")}
            </strong>

            <span>
              / {target.toLocaleString("zh-CN")}
            </span>
          </div>


          <div className="progress-track">
            <span
              style={{
                width: `${pushupProgress}%`,
              }}
            />
          </div>


          <div className="progress-meta">
            <span>
              已完成 {pushupProgress}%
            </span>

            <span>
              剩余 {remaining.toLocaleString("zh-CN")} 个
            </span>
          </div>
        </div>
      </section>



      {/* 本期文章 */}
      <section
        id="notes"
        className="notes shell section-space"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              最近更新
            </p>

            <h2>
              本期文章
            </h2>
          </div>


          <Link
            className="text-link"
            href="/posts"
          >
            查看全部文章 →
          </Link>
        </div>



        {/* 头版文章 */}
        {featured && (
          <article className="featured-post post-card">
            <div className="post-visual visual-summer">
              {featured.image ? (
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="post-image"
                />
              ) : (
                <span>
                  盛夏
                  <br />
                  2026
                </span>
              )}
            </div>


            <div className="post-content">
              <p className="post-meta">
                {formatPostDate(featured.date)} · 头版
              </p>


              <h3>
                <Link href={`/posts/${featured.slug}`}>
                  {featured.title}
                </Link>
              </h3>


              <p>
                {cleanExcerpt(featured.excerpt)}
              </p>


              <Link
                className="text-link"
                href={`/posts/${featured.slug}`}
              >
                继续阅读 →
              </Link>
            </div>
          </article>
        )}



        {/* 其他文章 */}
        <div className="post-grid">
          {cards.map((post, index) => (
            <article
              className="post-card small"
              key={post.id}
            >
              <div
                className={`post-visual ${
                  index === 0
                    ? "visual-yellow"
                    : index === 1
                      ? "visual-blue"
                      : "visual-green"
                }`}
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="post-image"
                  />
                ) : (
                  <span
                    style={{
                      whiteSpace: "pre-line",
                    }}
                  >
                    {formatShortDate(post.date)}
                  </span>
                )}
              </div>


              <div className="post-content">
                <p className="post-meta">
                  {formatPostDate(post.date)} · 周记
                </p>


                <h3>
                  <Link href={`/posts/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>


                <p>
                  {cleanExcerpt(post.excerpt)}
                </p>


                <Link
                  className="text-link"
                  href={`/posts/${post.slug}`}
                >
                  继续阅读 →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>



      {/* 生活收藏 */}
      <section
        id="archive"
        className="archive shell section-space"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              生活档案
            </p>

            <h2>
              收藏目录
            </h2>
          </div>
        </div>



        <div className="archive-grid">
          <a
            href="#"
            className="archive-card"
          >
            <span className="archive-icon">
              ♫
            </span>

            <strong>
              音乐清单
            </strong>

            <small>
              反复播放的声音
            </small>
          </a>


          <a
            href="#"
            className="archive-card"
          >
            <span className="archive-icon">
              ⌁
            </span>

            <strong>
              城市散步
            </strong>

            <small>
              公园、街道与照片
            </small>
          </a>


          <a
            href="#"
            className="archive-card"
          >
            <span className="archive-icon">
              ◫
            </span>

            <strong>
              房间物品
            </strong>

            <small>
              居住空间的细节
            </small>
          </a>


          <a
            href="#"
            className="archive-card"
          >
            <span className="archive-icon">
              ◎
            </span>

            <strong>
              观影档案
            </strong>

            <small>
              电影、剧集与感受
            </small>
          </a>
        </div>
      </section>



      {/* 后记 */}
      <section
        id="about"
        className="about shell section-space"
      >
        <p className="eyebrow">
          关于本站
        </p>


        <div className="about-grid">
          <h2>
            一个人的网站，
            <br />
            应该像他的房间。
          </h2>


          <div>
            <p>
              不必每件东西都有用，
              也不必每篇文章都得出结论。
              这里保存一些生活留下的痕迹，
              让时间不至于全部悄无声息地消失。
            </p>


            <p>
              LMN516 建立于 2025 年，
              持续更新于深圳。
            </p>


            <div className="about-links">
              <a href="mailto:hello@lmn516.com">
                写信
              </a>

              <a href="https://lmn516.com/feed/">
                RSS
              </a>
            </div>
          </div>
        </div>
      </section>



      {/* 页脚 */}
      <footer className="site-footer shell">
        <span>
          © 2025–2026 LMN516
        </span>

        <span>
          一本持续更新的个人生活杂志。
        </span>
      </footer>
    </main>
  );
}
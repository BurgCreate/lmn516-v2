import Link from "next/link";
import type { Post } from "@/lib/wordpress";

type LatestPostsProps = {
  featured?: Post;
  cards: Post[];
};

function cleanExcerpt(excerpt?: string | null) {
  return (excerpt ?? "")
    .replace(/\[&hellip;\]/g, "")
    .replace(/&hellip;/g, "…")
    .trim();
}

function formatPostDate(date?: string | null) {
  if (!date) return "";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return `${parsedDate.getFullYear()}.${String(
    parsedDate.getMonth() + 1
  ).padStart(2, "0")}.${String(parsedDate.getDate()).padStart(2, "0")}`;
}

function formatShortDate(date?: string | null) {
  if (!date) return "";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "";

  return `${String(parsedDate.getMonth() + 1).padStart(2, "0")}
${String(parsedDate.getDate()).padStart(2, "0")}`;
}

export default function LatestPosts({ featured, cards }: LatestPostsProps) {
  return (
    <section id="notes" className="notes shell section-space">
      <div className="section-heading">
        <div>
          <p className="eyebrow">最近更新</p>
          <h2>本期文章</h2>
        </div>

        <Link className="text-link" href="/posts">
          查看全部文章 →
        </Link>
      </div>

      {featured && (
        <Link
          className="featured-post post-card post-card-link"
          href={`/posts/${featured.slug}`}
          aria-label={`阅读文章：${featured.title}`}
        >
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

            <h3>{featured.title}</h3>

            <p>{cleanExcerpt(featured.excerpt)}</p>

            <span className="text-link">继续阅读 →</span>
          </div>
        </Link>
      )}

      <div className="post-grid">
        {cards.map((post, index) => (
          <Link
            className="post-card small post-card-link"
            href={`/posts/${post.slug}`}
            aria-label={`阅读文章：${post.title}`}
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
                <span style={{ whiteSpace: "pre-line" }}>
                  {formatShortDate(post.date)}
                </span>
              )}
            </div>

            <div className="post-content">
              <p className="post-meta">
                {formatPostDate(post.date)} · 周记
              </p>

              <h3>{post.title}</h3>

              <p>{cleanExcerpt(post.excerpt)}</p>

              <span className="text-link">继续阅读 →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

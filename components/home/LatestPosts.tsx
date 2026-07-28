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
              <Link href={`/posts/${featured.slug}`}>{featured.title}</Link>
            </h3>

            <p>{cleanExcerpt(featured.excerpt)}</p>

            <Link className="text-link" href={`/posts/${featured.slug}`}>
              继续阅读 →
            </Link>
          </div>
        </article>
      )}

      <div className="post-grid">
        {cards.map((post, index) => (
          <article className="post-card small" key={post.id}>
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

              <h3>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h3>

              <p>{cleanExcerpt(post.excerpt)}</p>

              <Link className="text-link" href={`/posts/${post.slug}`}>
                继续阅读 →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

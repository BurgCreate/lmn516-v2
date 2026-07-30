import Link from "next/link";
import type { Post } from "@/lib/wordpress";
import { getPosts } from "@/lib/wordpress";

export const revalidate = 300;

function cleanExcerpt(excerpt?: string | null) {
  return (excerpt ?? "")
    .replace(/\[&hellip;\]/g, "")
    .replace(/&hellip;/g, "…")
    .trim();
}

function isWideCard(index: number) {
  return index > 0 && (index + 1) % 9 === 0;
}

function ArticleCard({
  post,
  wide,
}: {
  post: Post;
  wide: boolean;
}) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className={`article-wall-card post-card post-card-link ${
        wide ? "article-wall-card-wide" : "article-wall-card-portrait"
      }`}
      aria-label={`阅读文章：${post.title}`}
    >
      <div className="article-wall-visual post-visual">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="post-image"
          />
        ) : (
          <span className="article-wall-image-placeholder">
            LMN516
          </span>
        )}
      </div>

      <div className="article-wall-content post-content">
        <p className="post-meta">
          {post.date} · {wide ? "头版" : "周记"}
        </p>

        <h2>{post.title}</h2>

        <p className="article-wall-excerpt">
          {cleanExcerpt(post.excerpt)}
        </p>

        <span className="text-link">
          继续阅读 →
        </span>
      </div>
    </Link>
  );
}

export default async function ArticleWallPage() {
  const posts = await getPosts(100);

  return (
    <main className="article-wall-page shell">
      <Link href="/" className="back">
        ← 返回花园入口
      </Link>

      <header className="article-wall-header">
        <p className="eyebrow">
          ARTICLE WALL
        </p>

        <h1>文章墙</h1>

        <p>
          {posts.length} 篇文章，沿着时间慢慢铺开。
        </p>
      </header>

      <section
        className="article-wall-grid"
        aria-label="全部文章"
      >
        {posts.map((post, index) => (
          <ArticleCard
            post={post}
            wide={isWideCard(index)}
            key={post.id}
          />
        ))}
      </section>
    </main>
  );
}
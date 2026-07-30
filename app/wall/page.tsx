import Link from "next/link";
import { getAllPosts } from "@/lib/wordpress";

export const revalidate = 300;

function cardShape(index: number) {
  const position = index % 12;

  if (position === 0 || position === 7) return "article-wall-card-wide";
  if (position === 4) return "article-wall-card-tall";
  return "article-wall-card-portrait";
}

export default async function ArticleWallPage() {
  const posts = await getAllPosts();

  return (
    <main className="article-wall-page shell">
      <Link href="/" className="back">
        ← 返回花园入口
      </Link>

      <header className="article-wall-header">
        <p className="eyebrow">ARTICLE WALL</p>
        <h1>文章墙</h1>
        <p>
          {posts.length} 篇文章，沿着图片与文字慢慢铺开。
        </p>
      </header>

      <section className="article-wall-grid" aria-label="全部文章">
        {posts.map((post, index) => (
          <Link
            href={`/posts/${post.slug}`}
            className={`article-wall-card ${cardShape(index)}`}
            aria-label={`阅读文章：${post.title}`}
            key={post.id}
          >
            <div className="article-wall-image">
              {post.image ? (
                <img src={post.image} alt="" />
              ) : (
                <span className="article-wall-placeholder" aria-hidden="true">
                  LMN516
                </span>
              )}
            </div>

            <div className="article-wall-copy">
              <time>{post.date}</time>
              <h2>{post.title}</h2>
              <span>阅读文章 →</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

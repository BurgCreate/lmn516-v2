import Link from "next/link";
import type { Post } from "@/lib/wordpress";

type LatestPostsProps = { featured?: Post; cards: Post[] };

function cleanExcerpt(excerpt?: string | null) {
  return (excerpt ?? "").replace(/\[&hellip;\]/g, "").replace(/&hellip;/g, "…").trim();
}

function formatPostDate(date?: string | null) {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
}

export default function LatestPosts({ featured, cards }: LatestPostsProps) {
  const posts = [featured, ...cards].filter(Boolean).slice(0, 4) as Post[];

  return (
    <section id="notes" className="v3-latest">
      <div className="v3-section-title">
        <h2><span aria-hidden="true">🌱</span> 最近更新</h2>
        <Link href="/posts">查看全部 →</Link>
      </div>
      <div className="v3-post-grid">
        {posts.map((post) => (
          <Link className="v3-post-card" href={`/posts/${post.slug}`} key={post.id}>
            <div className="v3-post-image">
              {post.image ? <img src={post.image} alt="" /> : <span>LMN516</span>}
            </div>
            <div className="v3-post-body">
              <h3>{post.title}</h3>
              <time>{formatPostDate(post.date)}</time>
              <p>{cleanExcerpt(post.excerpt) || "把生活里的小事，好好记录下来。"}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

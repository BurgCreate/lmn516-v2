import Link from "next/link";
import type { Post } from "@/lib/wordpress";

function cleanExcerpt(excerpt = "") {
  return excerpt.replace(/\[&hellip;\]/g, "").replace(/&hellip;/g, "…").trim();
}

export default function LatestPosts({ posts }: { posts: Post[] }) {
  return (
    <section className="v3-latest" aria-labelledby="latest-title">
      <div className="v3-section-heading">
        <h2 id="latest-title"><span aria-hidden="true">🌱</span> 最近更新</h2>
        <Link href="/posts">查看全部 →</Link>
      </div>
      <div className="v3-post-grid">
        {posts.map((post) => (
          <Link href={`/posts/${post.slug}`} className="v3-post-card" key={post.id}>
            <div className="v3-post-image">
              {post.image ? <img src={post.image} alt="" /> : <span>LMN516</span>}
            </div>
            <div className="v3-post-copy">
              <h3>{post.title}</h3>
              <time>{post.date.replaceAll(".", "-")}</time>
              <p>{cleanExcerpt(post.excerpt)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

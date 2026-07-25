import Link from "next/link";
import { getPosts } from "@/lib/wordpress";

export const revalidate = 300;

export default async function ArchivePage() {
  const posts = await getPosts(100);
  return (
    <main className="shell narrow page">
      <Link href="/" className="back">← 返回首页</Link>
      <p className="eyebrow">Archive</p>
      <h1>文章归档</h1>
      <div className="archive-list">
        {posts.map((post) => (
          <article key={post.id}>
            <time>{post.date}</time>
            <h2><Link href={`/posts/${post.slug}`}>{post.title}</Link></h2>
          </article>
        ))}
      </div>
    </main>
  );
}

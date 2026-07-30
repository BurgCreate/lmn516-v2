import Link from "next/link";
import { GardenCorner, GardenPageHero } from "@/components/garden";
import { getPosts } from "@/lib/wordpress";

export const revalidate = 300;

export default async function ArchivePage() {
  const posts = await getPosts(100);
  return (
    <main className="shell garden-subpage garden-archive-page">
      <Link href="/" className="back">← 返回花园入口</Link>
      <GardenPageHero
        scene="reading"
        place="阅读树下"
        eyebrow="Archive · 植物档案馆"
        title="文章归档"
        intro="把已经长成的文字重新整理在树下。它们来自不同的季节，也保存着当时真实的生活。"
      />
      <section className="garden-archive-sheet">
        <GardenCorner side="left" variant="flowers" />
        <div className="archive-list">
          {posts.map((post) => (
            <article key={post.id}>
              <time>{post.date}</time>
              <h2><Link href={`/posts/${post.slug}`}>{post.title}</Link></h2>
              <span aria-hidden="true">阅读 →</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/wordpress";

export const revalidate = 300;

export default async function PostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="shell narrow page">
      <Link href="/" className="back">← 返回首页</Link>
      <article className="article">
        <p className="eyebrow">{post.date}</p>
        <h1>{post.title}</h1>
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}

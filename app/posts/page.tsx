import Link from "next/link";
import { getPosts } from "@/lib/wordpress";

export const revalidate = 300;

export default async function PostsPage() {
  const posts = await getPosts(100);

  return (
    <main className="posts-page">

      <section className="posts-header">

        <p className="eyebrow">
          ALL POSTS
        </p>

        <h1>
          全部文章
        </h1>

        <p>
          一共 {posts.length} 篇文章
        </p>

      </section>

      <section className="posts-list">

        {posts.map((post) => (

          <article
            key={post.id}
            className="post-row"
          >

            <div>

              <p className="post-date">
                {post.date}
              </p>

              <h2>

                <Link href={`/posts/${post.slug}`}>
                  {post.title}
                </Link>

              </h2>

              <p>

  {(post.excerpt ?? "")

    .replace(/\[&hellip;\]/g, "")

    .replace(/&hellip;/g, "…")}

</p>

            </div>

            <Link
              href={`/posts/${post.slug}`}
              className="text-link"
            >
              阅读 →
            </Link>

          </article>

        ))}

      </section>

    </main>
  );
}
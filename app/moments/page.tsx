import Link from "next/link";
import { getMoments } from "@/lib/wordpress";

export const revalidate = 300;

export default async function MomentsPage() {
  const moments = await getMoments(50);

  return (
    <main className="shell subpage">
      <Link href="/" className="text-link">
        ← 返回首页
      </Link>

      <p className="eyebrow">Moments</p>

      <h1>碎碎念</h1>

      <p className="moments-intro">
        一些不必写成长文章的生活片段。
      </p>

      <div className="moments-list">
        {moments.length > 0 ? (
          moments.map((moment) => (
            <article
              key={moment.id}
              id={`moment-${moment.id}`}
              className="moment-item"
            >
              <div
                className="moment-content"
                dangerouslySetInnerHTML={{
                  __html: moment.content,
                }}
              />

              {moment.image && (
                <img
                  src={moment.image}
                  alt=""
                  className="moment-image"
                />
              )}

              <time className="moment-date">
                {moment.date}
              </time>
            </article>
          ))
        ) : (
          <p className="moments-empty">
            暂时还没有碎碎念。
          </p>
        )}
      </div>
    </main>
  );
}
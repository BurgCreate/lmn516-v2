import Link from "next/link";
import { GardenCorner, GardenPageHero } from "@/components/garden";
import { getMoments } from "@/lib/wordpress";

export const revalidate = 300;

export default async function MomentsPage() {
  const moments = await getMoments(50);

  return (
    <main className="shell garden-subpage garden-moments-page">
      <Link href="/" className="text-link">← 返回花园入口</Link>
      <GardenPageHero
        scene="moments"
        place="石板便笺"
        eyebrow="Moments · 花园便笺"
        title="碎碎念"
        intro="一些不必写成长文章的生活片段。像落在小路上的叶子，顺手捡起来，也值得被保存。"
      />

      <section className="garden-moments-field">
        <GardenCorner side="right" variant="flowers" />
        <div className="moments-list">
          {moments.length > 0 ? (
            moments.map((moment) => (
              <article key={moment.id} id={`moment-${moment.id}`} className="moment-item">
                <div className="moment-content" dangerouslySetInnerHTML={{ __html: moment.content }} />
                {moment.image && <img src={moment.image} alt="" className="moment-image" />}
                <time className="moment-date">{moment.date}</time>
              </article>
            ))
          ) : (
            <p className="moments-empty">今天的石板上还没有新便笺。</p>
          )}
        </div>
      </section>
    </main>
  );
}

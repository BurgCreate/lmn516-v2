import Image from "next/image";
import Link from "next/link";

const archiveItems = [
  {
    href: "/music",
    icon: "♫",
    title: "音乐清单",
    description: "收藏反复播放的声音与年度专辑。",
    meta: "持续更新",
  },
  {
    href: "/walks",
    icon: "⌁",
    title: "城市散步",
    description: "记录公园、街道与路上的照片。",
    meta: "深圳与远方",
  },
  {
    href: "/room",
    icon: "◫",
    title: "房间物品",
    description: "保存居住空间和日常用品的细节。",
    meta: "生活观察",
  },
  {
    href: "/movies",
    icon: "◎",
    title: "观影档案",
    description: "电影、剧集以及看完之后留下的感受。",
    meta: "不定期整理",
  },
];

export default function LifeArchive() {
  return (
    <section id="archive" className="archive shell section-space">
      <div className="archive-intro">
        <div className="archive-intro-copy">
          <p className="eyebrow">生活档案 · Digital Garden</p>
          <h2>收藏目录</h2>
          <p>
            把音乐、影像、散步和日常物品分门别类地保存下来。
            它们不必成为文章，也值得拥有自己的位置。
          </p>
        </div>

        <div className="archive-girl" aria-hidden="true">
          <Image
            src="/images/garden/garden-girl.jpeg"
            alt=""
            width={360}
            height={360}
            sizes="(max-width: 720px) 180px, 260px"
          />
        </div>
      </div>

      <div className="archive-grid">
        {archiveItems.map((item) => (
          <Link href={item.href} className="archive-card" key={item.href}>
            <span className="archive-icon" aria-hidden="true">{item.icon}</span>
            <span className="archive-card-copy">
              <strong>{item.title}</strong>
              <small>{item.description}</small>
            </span>
            <span className="archive-card-footer">
              <em>{item.meta}</em>
              <b aria-hidden="true">→</b>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

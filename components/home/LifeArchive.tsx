import Link from "next/link";

const archiveItems = [
  {
    href: "/music",
    icon: "♫",
    title: "音乐清单",
    description: "反复播放的声音",
  },
  {
    href: "/walks",
    icon: "⌁",
    title: "城市散步",
    description: "公园、街道与照片",
  },
  {
    href: "/room",
    icon: "◫",
    title: "房间物品",
    description: "居住空间的细节",
  },
  {
    href: "/movies",
    icon: "◎",
    title: "观影档案",
    description: "电影、剧集与感受",
  },
];

export default function LifeArchive() {
  return (
    <section id="archive" className="archive shell section-space">
      <div className="section-heading">
        <div>
          <p className="eyebrow">生活档案</p>
          <h2>收藏目录</h2>
        </div>
      </div>

      <div className="archive-grid">
        {archiveItems.map((item) => (
          <Link href={item.href} className="archive-card" key={item.href}>
            <span className="archive-icon">{item.icon}</span>
            <strong>{item.title}</strong>
            <small>{item.description}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}

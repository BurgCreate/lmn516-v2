import Link from "next/link";

const items = [
  { href: "/posts", icon: "📖", title: "阅读" },
  { href: "/photos", icon: "📷", title: "摄影" },
  { href: "/music", icon: "🎧", title: "音乐" },
  { href: "/moments", icon: "🪴", title: "随笔" },
];

export default function LifeArchive() {
  return (
    <section id="archive" className="v3-life">
      <div className="v3-section-title v3-section-title-compact">
        <h2><span aria-hidden="true">🌱</span> 生活档案</h2>
      </div>
      <div className="v3-life-grid">
        {items.map((item) => (
          <Link href={item.href} className="v3-life-card" key={item.href}>
            <span className="v3-life-icon" aria-hidden="true">{item.icon}</span>
            <strong>{item.title}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";

const items = [
  { href: "/posts", icon: "📖", label: "阅读" },
  { href: "/photos", icon: "📷", label: "摄影" },
  { href: "/music", icon: "🎧", label: "音乐" },
  { href: "/moments", icon: "🪴", label: "随笔" },
];

export default function LifeArchive() {
  return (
    <section className="v3-archive" aria-labelledby="archive-title">
      <div className="v3-section-heading v3-section-heading-tight">
        <h2 id="archive-title"><span aria-hidden="true">🌱</span> 生活档案</h2>
      </div>
      <div className="v3-archive-grid">
        {items.map((item) => (
          <Link href={item.href} className="v3-archive-card" key={item.href}>
            <span aria-hidden="true">{item.icon}</span>
            <strong>{item.label}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}

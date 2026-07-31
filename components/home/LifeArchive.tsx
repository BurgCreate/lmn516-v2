import Link from "next/link";

const items = [
  { href: "/posts", icon: "/garden-assets/icons/book.svg", label: "阅读" },
  { href: "/photos", icon: "/garden-assets/icons/camera.svg", label: "摄影" },
  { href: "/music", icon: "/garden-assets/icons/headphones.svg", label: "音乐" },
  { href: "/moments", icon: "/garden-assets/icons/plant.svg", label: "随笔" },
];

export default function LifeArchive() {
  return (
    <section className="v3-archive" aria-labelledby="archive-title">
      <div className="v3-section-heading v3-section-heading-tight">
        <h2 id="archive-title"><span aria-hidden="true">♧</span> 生活档案</h2>
      </div>
      <div className="v3-archive-grid">
        {items.map((item) => (
          <Link href={item.href} className="v3-archive-card" key={item.href}>
            <img src={item.icon} alt="" aria-hidden="true" />
            <strong>{item.label}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}

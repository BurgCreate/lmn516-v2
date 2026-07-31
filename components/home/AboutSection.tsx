import Link from "next/link";

export default function AboutSection() {
  return (
    <section id="about" className="v3-about">
      <div className="v3-section-title v3-section-title-compact">
        <h2><span aria-hidden="true">🌱</span> 关于我</h2>
      </div>
      <div className="v3-about-card">
        <img src="/garden-assets/characters/garden-girl-about.webp" alt="戴草帽、坐着读书的小女孩插画" />
        <div className="v3-about-copy">
          <p>一个安静的人，喜欢记录生活，<br />热爱自然，持续成长中。</p>
          <Link href="/about">了解更多 →</Link>
        </div>
        <span className="v3-about-cat" aria-hidden="true">🐈</span>
      </div>
    </section>
  );
}

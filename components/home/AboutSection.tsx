import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="v3-about" aria-labelledby="about-title">
      <div className="v3-section-heading v3-section-heading-tight">
        <h2 id="about-title"><span aria-hidden="true">♧</span> 关于我</h2>
      </div>
      <div className="v3-about-card">
        <img className="v3-about-girl" src="/garden-assets/characters/garden-girl-reading.webp" alt="戴草帽阅读的小女孩插画" />
        <img className="v3-about-rabbit" src="/garden-assets/animals/rabbit-small.png" alt="" aria-hidden="true" />
        <div className="v3-about-copy">
          <p>一个安静的人，喜欢记录生活，<br />热爱自然，持续成长中。</p>
          <Link href="/about">了解更多 →</Link>
        </div>
        <img className="v3-about-cat" src="/garden-assets/animals/cat-small.png" alt="" aria-hidden="true" />
      </div>
    </section>
  );
}

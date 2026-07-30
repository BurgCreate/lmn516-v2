import Link from "next/link";
import { GardenFloraRibbon, GardenOrnament } from "@/components/garden";

export default function AboutSection() {
  return (
    <section id="about" className="about shell section-space garden-content-section garden-content-section-about">
      <GardenFloraRibbon className="garden-content-flora garden-content-flora-top" />
      <div className="about-card garden-about-card">
        <GardenOrnament variant="vine" className="garden-about-vine garden-about-vine-left" />
        <GardenOrnament variant="bellflower" className="garden-about-vine garden-about-vine-right" />
        <div>
          <p className="eyebrow">关于本站</p>
          <h2>一个人的网站，应该像他的房间。</h2>
        </div>

        <div className="about-copy">
          <p>
            LMN516 是一个持续生长的个人数字花园。
            这里保存文章、照片、音乐、碎碎念，以及一些需要很多时间才能完成的事情。
          </p>

          <div className="about-links">
            <Link href="/about">了解本站 →</Link>
            <a href="mailto:hello@lmn516.com">写信</a>
          </div>
        </div>
      </div>
      <GardenFloraRibbon className="garden-content-flora garden-content-flora-bottom" density="light" />
    </section>
  );
}

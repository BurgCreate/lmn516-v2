import Link from "next/link";
import { GardenCorner, GardenPageHero } from "@/components/garden";

export default function AboutPage() {
  return (
    <main className="shell garden-subpage garden-about-page">
      <Link href="/" className="back">← 返回花园入口</Link>
      <GardenPageHero
        scene="about"
        place="山坡树屋"
        eyebrow="About · 花园主人"
        title="关于这座花园"
        intro="LMN516 是 Mo 的个人生活档案。这里保存文字、照片、音乐、碎碎念，以及一些需要很久才能完成的计划。"
      />

      <section className="garden-story-card prose">
        <GardenCorner side="right" variant="leaves" />
        <p>
          它不是为了追逐流量，也不打算把生活包装成标准答案。
          它只是把走过的时间留下来，让每一段看似普通的日子都能在这里拥有自己的位置。
        </p>
        <p>
          这里会继续生长。页面会改变，植物会变多，新的路径也会慢慢出现。
          但核心不会变：记录生活，培育成长。
        </p>
      </section>
    </main>
  );
}

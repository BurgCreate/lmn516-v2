import Link from "next/link";
import RandomPhotoWall from "@/components/RandomPhotoWall";
import HomeClock from "@/components/home/HomeClock";
import type { MediaImage, Post } from "@/lib/wordpress";

type TodayInfo = { date: string; fullDate: string; weekday: string };
type HeroSectionProps = {
  mediaImages: MediaImage[];
  today: TodayInfo;
  yearProgress: string;
  featured?: Post;
  pushupPost: Post | null;
  pushups: number;
  target: number;
  pushupProgress: string;
  remaining: number;
};

export default function HeroSection({
  mediaImages,
  pushupPost,
  pushups,
  target,
  pushupProgress,
}: HeroSectionProps) {
  return (
    <section className="v3-hero" aria-label="首页概览">
      <div className="v3-photo-column">
        <RandomPhotoWall images={mediaImages} />
        <div className="v3-photo-dots" aria-hidden="true">
          <span className="is-active" />
          <span />
          <span />
          <span />
        </div>
      </div>

      <aside className="v3-today-card">
        <header className="v3-card-heading">
          <span className="v3-heading-icon" aria-hidden="true">▱</span>
          <h1>今日档案</h1>
          <span className="v3-potted-plant" aria-hidden="true">🪴</span>
        </header>

        <div className="v3-today-content">
          <div className="v3-project">
            <span className="v3-pushup-figure" aria-hidden="true">🏃</span>
            <div className="v3-project-copy">
              <span className="v3-small-label">持续进行</span>
              <h2>一万个俯卧撑</h2>
              <div className="v3-progress-number">
                <strong>{pushups.toLocaleString("zh-CN")}</strong>
                <span>/ {target.toLocaleString("zh-CN")} 个</span>
              </div>
              <div className="v3-progress-track" role="progressbar" aria-valuenow={pushups} aria-valuemax={target}>
                <span style={{ width: `${pushupProgress}%` }} />
              </div>
              {pushupPost && <Link href={`/posts/${pushupPost.slug}`}>查看记录 →</Link>}
            </div>
          </div>

          <HomeClock />
        </div>
      </aside>
    </section>
  );
}

import Link from "next/link";
import RandomPhotoWall from "@/components/RandomPhotoWall";
import type { MediaImage, Post } from "@/lib/wordpress";

type TodayInfo = {
  date: string;
  fullDate: string;
  weekday: string;
};

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
  today,
  yearProgress,
  featured,
  pushupPost,
  pushups,
  target,
  pushupProgress,
  remaining,
}: HeroSectionProps) {
  return (
    <section id="garden-today" className="hero shell">
      <div className="hero-photo-area">
        <RandomPhotoWall images={mediaImages} />
      </div>

      <aside className="today-card" aria-label="今日档案与持续进行">
        <div className="today-summary">
          <p className="card-label">今日档案</p>

          <div className="date-block">
            <strong>{today.date}</strong>
            <span>{today.weekday} · 盛夏</span>
          </div>

          <dl>
            <div>
              <dt>年度进度</dt>
              <dd>{yearProgress}%</dd>
            </div>

            <div>
              <dt>本期封面</dt>
              <dd>{featured?.title ?? "尚未更新"}</dd>
            </div>
          </dl>
        </div>

        <div className="today-project">
          <div className="today-project-heading">
            <div>
              <p className="card-label">持续进行</p>
              <h2>一万个俯卧撑</h2>
            </div>

            {pushupPost && (
              <Link className="text-link" href={`/posts/${pushupPost.slug}`}>
                查看记录 →
              </Link>
            )}
          </div>

          <div className="progress-number">
            <strong>{pushups.toLocaleString("zh-CN")}</strong>
            <span>/ {target.toLocaleString("zh-CN")}</span>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={target}
            aria-valuenow={pushups}
            aria-label="一万个俯卧撑完成进度"
          >
            <span style={{ width: `${pushupProgress}%` }} />
          </div>

          <div className="progress-meta">
            <span>已完成 {pushupProgress}%</span>
            <span>剩余 {remaining.toLocaleString("zh-CN")} 个</span>
          </div>
        </div>
      </aside>
    </section>
  );
}

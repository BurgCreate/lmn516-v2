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
  pushups: number;
  target: number;
};

export default function HeroSection({
  mediaImages,
  today,
  yearProgress,
  featured,
  pushups,
  target,
}: HeroSectionProps) {
  return (
    <section className="hero shell">
      <div className="hero-photo-area">
        <RandomPhotoWall images={mediaImages} />
      </div>

      <aside className="today-card">
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

          <div>
            <dt>俯卧撑</dt>
            <dd>
              {pushups.toLocaleString("zh-CN")} /{" "}
              {target.toLocaleString("zh-CN")}
            </dd>
          </div>
        </dl>
      </aside>
    </section>
  );
}

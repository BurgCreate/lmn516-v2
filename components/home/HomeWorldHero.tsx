import Link from "next/link";
import RandomPhotoWall from "@/components/RandomPhotoWall";
import type { MediaImage, Post } from "@/lib/wordpress";

type Props = {
  mediaImages: MediaImage[];
  featured?: Post;
  pushups: number;
  target: number;
  yearProgress: string;
};

export default function HomeWorldHero({ mediaImages, featured, pushups, target, yearProgress }: Props) {
  const progress = target > 0 ? Math.min((pushups / target) * 100, 100) : 0;

  return (
    <section className="home-world" aria-labelledby="home-world-title">
      <div className="home-world-sky" aria-hidden="true">
        <span className="home-world-cloud cloud-a" />
        <span className="home-world-cloud cloud-b" />
        <span className="home-world-sun" />
      </div>

      <div className="home-world-stage shell">
        <div className="home-world-copy">
          <p className="home-world-kicker">LMN516 · DIGITAL GARDEN</p>
          <h1 id="home-world-title">欢迎来到<br /><span>我的花园</span></h1>
          <p>文字、照片、音乐和生活，都在这里慢慢长成真实的东西。</p>
          <div className="home-world-actions">
            <a href="#home-world-map">进入花园</a>
            <Link href="/about">认识我</Link>
          </div>
        </div>

        <div className="home-world-art" aria-label="花园女孩正在花园里种花">
          <img src="/garden-assets/characters/garden-girl-home.jpeg" alt="花园女孩在花园中种花" />
          <span className="home-world-art-caption">THE GARDEN KEEPER</span>
        </div>
      </div>

      <div id="home-world-map" className="home-world-map shell" aria-label="花园入口">
        <Link href="/posts" className="world-place world-place-notes">
          <span className="world-place-illustration">✿</span><strong>文章花圃</strong><small>最近长出的文字</small>
        </Link>
        <Link href="/photos" className="world-place world-place-photos">
          <span className="world-place-illustration">▧</span><strong>照片晾台</strong><small>收藏看见的光</small>
        </Link>
        <Link href="/music" className="world-place world-place-music">
          <span className="world-place-illustration">♫</span><strong>音乐小屋</strong><small>正在播放的声音</small>
        </Link>
        <Link href="/moments" className="world-place world-place-moments">
          <span className="world-place-illustration">☁</span><strong>碎碎念树</strong><small>今天落下的纸条</small>
        </Link>
        <a href="#about" className="world-place world-place-mail">
          <span className="world-place-illustration">✉</span><strong>花园信箱</strong><small>留下你的痕迹</small>
        </a>
      </div>

      <div className="home-world-real shell">
        <div className="home-world-photo">
          <div className="world-section-label">今日取景框</div>
          <RandomPhotoWall images={mediaImages} />
        </div>
        <aside className="home-world-board">
          <p>花园今日记录</p>
          <dl>
            <div><dt>年度进度</dt><dd>{yearProgress}%</dd></div>
            <div><dt>俯卧撑</dt><dd>{pushups.toLocaleString("zh-CN")} / {target.toLocaleString("zh-CN")}</dd></div>
          </dl>
          <div className="home-world-progress"><span style={{ width: `${progress}%` }} /></div>
          {featured && <Link href={`/posts/${featured.slug}`}>最新文章：{featured.title} →</Link>}
        </aside>
      </div>
    </section>
  );
}

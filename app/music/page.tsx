import Link from "next/link";
import MusicCoverGrid from "@/components/MusicCoverGrid";
import { music2026 } from "@/lib/music";
import { GardenCorner, GardenPageHero } from "@/components/garden";

const playlistUrl =
  "https://music.apple.com/cn/playlist/2026-%E9%9F%B3%E4%B9%90%E5%9B%9E%E5%BF%86/pl.rp-Yb77hn90p9yd";

const embedUrl =
  "https://embed.music.apple.com/cn/playlist/2026-%E9%9F%B3%E4%B9%90%E5%9B%9E%E5%BF%86/pl.rp-Yb77hn90p9yd";

export default function MusicPage() {
  return (
    <main className="music-page shell">
      <Link href="/" className="text-link music-back">
        ← 返回首页
      </Link>

      <GardenPageHero
        scene="music"
        place="音乐小屋"
        eyebrow="生活档案 · 音乐"
        title="2026 音乐回忆"
        intro="收藏这一年反复播放的声音。歌单会继续更新，留下旋律，也留下它们经过生活时的痕迹。"
      />

      <div className="music-garden-action">
        <a
          className="music-open-link"
          href={playlistUrl}
          target="_blank"
          rel="noreferrer"
        >
          在 Apple Music 中打开
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <section
        className="music-section garden-music-section"
        aria-labelledby="featured-music-title"
      >
        <div className="music-section-heading">
          <div>
            <p className="eyebrow">反复播放</p>
            <h2 id="featured-music-title">精选封面</h2>
          </div>

          <p>{music2026.length} 首正在收藏的声音</p>
        </div>

        <GardenCorner side="right" variant="leaves" />
        <MusicCoverGrid tracks={music2026} />
      </section>

      <section
        className="music-section music-player-section"
        aria-labelledby="playlist-title"
      >
        <div className="music-section-heading">
          <div>
            <p className="eyebrow">完整歌单</p>
            <h2 id="playlist-title">继续播放</h2>
          </div>

          <p>由 Apple Music 提供播放与同步</p>
        </div>

        <div className="music-player-shell">
          <iframe
            title="2026 音乐回忆 Apple Music 播放器"
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
            frameBorder="0"
            height="450"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
            src={embedUrl}
          />
        </div>
      </section>

      <footer className="music-page-footer">
        <span>音乐回忆 · 2026</span>
        <span>LMN516</span>
      </footer>
    </main>
  );
}
import Link from "next/link";

const appleMusicUrl =
  "https://music.apple.com/cn/playlist/2026-%E9%9F%B3%E4%B9%90%E5%9B%9E%E5%BF%86/pl.rp-Yb77hn90p9yd";

const appleMusicEmbedUrl =
  "https://embed.music.apple.com/cn/playlist/2026-%E9%9F%B3%E4%B9%90%E5%9B%9E%E5%BF%86/pl.rp-Yb77hn90p9yd";

export default function MusicPage() {
  return (
    <main className="subpage shell music-page">
      <Link href="/" className="text-link">
        ← 返回首页
      </Link>

      <header className="music-page-header">
        <p className="eyebrow">生活档案 · 2026</p>

        <h1>音乐回忆</h1>

        <p className="music-page-intro">
          这一年反复播放的声音。歌单会跟随 Apple Music 更新，专辑封面、歌曲与歌手也会一起留在这里。
        </p>
      </header>

      <section className="music-replay-card" aria-labelledby="music-replay-title">
        <div className="music-replay-heading">
          <div>
            <p className="music-replay-kicker">APPLE MUSIC REPLAY</p>
            <h2 id="music-replay-title">2026 音乐回忆</h2>
          </div>

          <span className="music-replay-year" aria-hidden="true">
            26
          </span>
        </div>

        <div className="music-embed-frame">
          <iframe
            title="Mo 的 2026 Apple Music 音乐回忆歌单"
            src={appleMusicEmbedUrl}
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
            loading="lazy"
          />
        </div>

        <div className="music-replay-footer">
          <p>点击歌曲即可试听，专辑封面与歌手信息由 Apple Music 自动显示。</p>

          <a
            href={appleMusicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="button-link"
          >
            在 Apple Music 中打开 ↗
          </a>
        </div>
      </section>
    </main>
  );
}

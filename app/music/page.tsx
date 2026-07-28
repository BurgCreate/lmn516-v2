import Image from "next/image";
import Link from "next/link";

type FeaturedAlbum = {
  title: string;
  artist: string;
  cover: string;
  href?: string;
};

/*
 * 把下载好的 WebP 封面放进 public/images/music/，
 * 再按下面的格式添加即可：
 *
 * {
 *   title: "歌曲或专辑名称",
 *   artist: "歌手名称",
 *   cover: "/images/music/文件名.webp",
 *   href: "Apple Music 链接（可选）",
 * },
 */
const featuredAlbums: FeaturedAlbum[] = [];

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

      <header className="music-hero">
        <div className="music-hero-copy">
          <p className="eyebrow">生活档案 · 音乐</p>
          <h1>2026 音乐回忆</h1>
          <p className="music-intro">
            收藏这一年反复播放的声音。歌单会继续更新，留下旋律，也留下它们经过生活时的痕迹。
          </p>

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

        <div className="music-mark" aria-hidden="true">
          <span>2026</span>
          <strong>♫</strong>
          <small>LMN516</small>
        </div>
      </header>

      {featuredAlbums.length > 0 && (
        <section className="music-section" aria-labelledby="featured-music-title">
          <div className="music-section-heading">
            <div>
              <p className="eyebrow">反复播放</p>
              <h2 id="featured-music-title">精选封面</h2>
            </div>
            <p>{featuredAlbums.length} 张正在收藏的声音</p>
          </div>

          <div className="music-cover-grid">
            {featuredAlbums.map((album) => {
              const content = (
                <>
                  <span className="music-cover-frame">
                    <Image
                      src={album.cover}
                      alt={`${album.title} - ${album.artist}`}
                      width={640}
                      height={640}
                      sizes="(max-width: 520px) 46vw, (max-width: 900px) 30vw, 220px"
                    />
                  </span>
                  <span className="music-cover-title">{album.title}</span>
                  <span className="music-cover-artist">{album.artist}</span>
                </>
              );

              return album.href ? (
                <a
                  key={`${album.title}-${album.artist}`}
                  className="music-cover-card"
                  href={album.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {content}
                </a>
              ) : (
                <article
                  key={`${album.title}-${album.artist}`}
                  className="music-cover-card"
                >
                  {content}
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="music-section music-player-section" aria-labelledby="playlist-title">
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

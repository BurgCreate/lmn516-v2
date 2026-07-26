import Link from "next/link";

export default function MusicPage() {
  return (
    <main className="subpage shell">
      <Link
        href="/"
        className="text-link"
      >
        ← 返回首页
      </Link>

      <p className="eyebrow">
        生活档案
      </p>

      <h1>
        音乐清单
      </h1>

      <p>
        收藏那些反复播放的声音。
        这里之后会记录歌曲、歌手、专辑，
        以及某段时间里最常听见的旋律。
      </p>
    </main>
  );
}
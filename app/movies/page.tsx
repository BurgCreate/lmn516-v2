import Link from "next/link";

export default function MoviesPage() {
  return (
    <main className="subpage shell">
      <Link href="/" className="text-link">
        ← 返回首页
      </Link>

      <p className="eyebrow">生活档案</p>

      <h1>观影档案</h1>

      <p>
        保存看过的电影、剧集、动画与纪录片，
        以及那些值得记住的观影感受。
      </p>
    </main>
  );
}
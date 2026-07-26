import Link from "next/link";

export default function WalksPage() {
  return (
    <main className="subpage shell">
      <Link href="/" className="text-link">
        ← 返回首页
      </Link>

      <p className="eyebrow">生活档案</p>

      <h1>城市散步</h1>

      <p>
        记录走过的公园、街道、社区与城市角落，
        也保存沿途拍下的照片和当时的感受。
      </p>
    </main>
  );
}
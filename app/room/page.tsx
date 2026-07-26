import Link from "next/link";

export default function RoomPage() {
  return (
    <main className="subpage shell">
      <Link href="/" className="text-link">
        ← 返回首页
      </Link>

      <p className="eyebrow">生活档案</p>

      <h1>房间物品</h1>

      <p>
        记录居住空间中的物品、设备和生活细节。
        那些每天都陪伴着我的东西，也组成了生活的一部分。
      </p>
    </main>
  );
}
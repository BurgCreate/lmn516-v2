import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="shell narrow page prose">
      <Link href="/" className="back">← 返回首页</Link>
      <p className="eyebrow">About</p>
      <h1>关于这个网站</h1>
      <p>
        LMN516 是 Mo 的个人生活档案。这里记录周记、旅行、音乐、观影、
        房间里的物品，以及一些需要很久才能完成的计划。
      </p>
      <p>
        它不是为了追逐流量，也不打算把生活包装成标准答案。
        它只是把走过的时间留下来。
      </p>
    </main>
  );
}

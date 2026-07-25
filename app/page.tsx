import Link from "next/link";
import { getPosts } from "@/lib/wordpress";

export const revalidate = 300;

export default async function HomePage() {
  const posts = await getPosts(8);

  return (
    <main>
      <header className="site-header shell">
        <Link href="/" className="brand">LMN516</Link>
        <nav>
          <Link href="/archive">归档</Link>
          <Link href="/about">关于</Link>
          <a href="https://lmn516.com/feed/" target="_blank">RSS</a>
        </nav>
      </header>

      <section className="hero shell">
        <p className="eyebrow">Mo 的个人生活档案</p>
        <h1>把日常留下来，<br />让时间有迹可循。</h1>
        <p className="hero-copy">
          记录周记、旅行、影像、音乐，以及一些缓慢但坚定的长期计划。
        </p>
      </section>

      <section className="dashboard shell">
        <article className="progress-card">
          <div>
            <p className="eyebrow">长期计划</p>
            <h2>一万个俯卧撑</h2>
            <p>把一个看起来很远的目标，拆成每天都能完成的一点点。</p>
          </div>
          <div className="progress-wrap">
            <div className="progress-meta"><span>当前进度</span><strong>18.3%</strong></div>
            <div className="progress"><span style={{ width: "18.3%" }} /></div>
            <small>1,833 / 10,000</small>
          </div>
        </article>

        <article className="quote-card">
          <p className="eyebrow">今天</p>
          <blockquote>认真生活的人，会在时间里留下自己的纹理。</blockquote>
        </article>
      </section>

      <section className="section shell">
        <div className="section-head">
          <div>
            <p className="eyebrow">最近更新</p>
            <h2>新写下来的东西</h2>
          </div>
          <Link href="/archive">查看全部</Link>
        </div>

        <div className="post-grid">
          {posts.map((post) => (
            <article className="post-card" key={post.id}>
              <p className="post-date">{post.date}</p>
              <h3><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3>
              <p>{post.excerpt}</p>
              <Link className="read-more" href={`/posts/${post.slug}`}>继续阅读</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell">
        <div className="section-head">
          <div>
            <p className="eyebrow">生活档案</p>
            <h2>不是栏目，是生活留下的分类</h2>
          </div>
        </div>
        <div className="archive-grid">
          {[
            ["周记", "每一周的生活碎片与想法"],
            ["旅行", "去过的城市、路线与途中所见"],
            ["音乐", "反复听过的歌和某段时间的声音"],
            ["观影", "看过的电影，以及留下来的感受"],
            ["房间", "物品、空间和生活方式的变化"],
            ["长期计划", "缓慢推进，但不轻易放弃的事情"]
          ].map(([title, desc]) => (
            <div className="archive-card" key={title}>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer shell">
        <div>
          <strong>LMN516</strong>
          <p>一个持续生长的个人网站。</p>
        </div>
        <p>© 2025–2026 Mo</p>
      </footer>
    </main>
  );
}

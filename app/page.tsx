import Link from "next/link";
import { getPosts } from "@/lib/wordpress";

export const revalidate = 300;

export default async function HomePage() {
  const posts = await getPosts(6);

  return (
    <main>

      <header className="site-header shell">
        <Link href="/" className="brand">
          LMN516
        </Link>

        <nav>
          <Link href="/archive">归档</Link>
          <Link href="/about">关于</Link>
          <a href="https://lmn516.com/feed/" target="_blank">
            RSS
          </a>
        </nav>
      </header>


      <section className="hero shell">

        <div className="hero-copy">

          <p className="eyebrow">
            2026 · Shenzhen
          </p>

          <h1>
            把普通日子，
            <br />
            认真存档。
          </h1>

          <p className="hero-text">
            这里是 Mo 的个人生活档案。
            记录周记、旅行、影像、音乐，
            以及那些多年以后依然值得回看的事情。
          </p>

        </div>


        <aside className="today-card">

          <p className="eyebrow">
            今日档案
          </p>

          <div className="date-big">
            07.25
          </div>

          <p>
            星期六 · 盛夏
          </p>

          <div className="info-row">
            <span>年度进度</span>
            <strong>56.4%</strong>
          </div>

          <div className="info-row">
            <span>最近更新</span>
            <strong>不如做熊猫</strong>
          </div>

          <div className="info-row">
            <span>俯卧撑</span>
            <strong>1833 / 10000</strong>
          </div>

        </aside>

      </section>


      <section className="project shell">

        <div>
          <p className="eyebrow">
            LONG TERM PROJECT
          </p>

          <h2>
            一万个俯卧撑
          </h2>

          <p>
            开始于 2026 年 2 月 16 日。
            没有宏大的宣言，
            只有每天一点点坚持。
          </p>

        </div>


        <div className="progress-panel">

          <strong>
            1833
          </strong>

          <span>
            / 10000
          </span>


          <div className="progress">
            <span style={{width:"18.33%"}} />
          </div>


          <small>
            已完成 18.33%
          </small>

        </div>

      </section>



      <section className="section shell">

        <div className="section-head">

          <div>
            <p className="eyebrow">
              LATEST NOTES
            </p>

            <h2>
              最近留下的痕迹
            </h2>

          </div>


          <Link href="/archive">
            查看全部 →
          </Link>

        </div>



        <div className="post-grid">

          {posts.map((post)=>(
            <article
              className="post-card"
              key={post.id}
            >

              <p className="post-date">
                {post.date}
              </p>

              <h3>
                <Link href={`/posts/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>

              <p>
                {post.excerpt}
              </p>


            </article>
          ))}

        </div>


      </section>



      <section className="section shell">

        <p className="eyebrow">
          LIFE ARCHIVE
        </p>

        <h2>
          生活档案
        </h2>


        <div className="archive-grid">

          {[
            ["周记","每一周的生活碎片"],
            ["旅行","城市与途中风景"],
            ["音乐","反复听过的声音"],
            ["观影","电影与留下的感受"],
            ["房间","生活空间里的物品"],
            ["计划","长期坚持的事情"]

          ].map(([title,desc])=>(

            <div
              className="archive-card"
              key={title}
            >

              <h3>
                {title}
              </h3>

              <p>
                {desc}
              </p>

            </div>

          ))}

        </div>


      </section>



      <footer className="footer shell">

        <strong>
          LMN516
        </strong>

        <p>
          一个持续生长的个人网站。
        </p>

      </footer>


    </main>
  );
}
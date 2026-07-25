import Link from "next/link";
import { getPosts } from "@/lib/wordpress";

export const revalidate = 300;

export default async function HomePage() {
  const posts = await getPosts(4);

  return (
    <main>

      {/* Header */}
      <header className="site-header shell">

        <Link href="/" className="brand">
          LMN516
        </Link>

        <nav>
          <Link href="/archive">周记</Link>
          <Link href="/archive">生活档案</Link>
          <Link href="/archive">长期计划</Link>
          <Link href="/about">关于</Link>
          <span>◐</span>
        </nav>

      </header>


      {/* Hero */}
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
            以及一些看起来没什么用，
            但多年后一定会很珍贵的事情。
          </p>


          <div className="hero-buttons">

            <Link href="/archive">
              开始阅读
            </Link>

            <Link href="/archive">
              浏览档案
            </Link>

          </div>

        </div>


        {/* 今日档案 */}

        <aside className="today-card">

          <p className="card-label">
            今日档案
          </p>


          <strong className="date-big">
            07.25
          </strong>

          <p>
            星期六 · 盛夏
          </p>


          <div className="info-row">
            <span>
              年度进度
            </span>
            <b>
              56.4%
            </b>
          </div>


          <div className="info-row">
            <span>
              最近更新
            </span>
            <b>
              不如做熊猫
            </b>
          </div>


          <div className="info-row">
            <span>
              俯卧撑
            </span>
            <b>
              1,833 / 10,000
            </b>
          </div>


        </aside>


      </section>



      {/* Project */}

      <section className="project shell">


        <div>

          <p className="eyebrow">
            LONG-TERM PROJECT
          </p>


          <h2>
            一万个俯卧撑
          </h2>


          <p>
            开始于 2026 年 2 月 16 日。
            没有宏大的宣言，
            只有一天一天如实记录。
          </p>


          <Link href="/">
            查看完整记录 →
          </Link>


        </div>



        <div className="progress-panel">

          <div>
            <strong>
              1,833
            </strong>

            <span>
              / 10,000
            </span>
          </div>


          <div className="progress">
            <span
              style={{
                width:"18.33%"
              }}
            />
          </div>


          <small>
            已完成 18.33% · 剩余 8,167
          </small>


        </div>


      </section>



      {/* Notes */}

      <section className="section shell">


        <div className="section-heading">

          <div>

            <p className="eyebrow">
              LATEST NOTES
            </p>

            <h2>
              最近更新
            </h2>

          </div>


          <Link href="/archive">
            全部文章 →
          </Link>


        </div>



        <div className="post-grid">


          {posts.map((post,index)=>(


            <article
              className={
                index === 0
                ? "post-card featured"
                : "post-card"
              }
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


              <Link href={`/posts/${post.slug}`}>
                继续阅读 →
              </Link>


            </article>


          ))}


        </div>


      </section>




      {/* Archive */}

      <section className="section shell">


        <p className="eyebrow">
          LIFE ARCHIVE
        </p>


        <h2>
          生活档案
        </h2>


        <div className="archive-grid">


          {[
            ["♫","音乐清单","100 首常听歌曲"],
            ["⌁","城市散步","公园、街道与照片"],
            ["◫","房间物品","居住空间的细节"],
            ["◎","观影档案","电影、剧集与感受"]
          ].map(item=>(


            <div
              className="archive-card"
              key={item[1]}
            >

              <span>
                {item[0]}
              </span>

              <h3>
                {item[1]}
              </h3>

              <p>
                {item[2]}
              </p>


            </div>


          ))}


        </div>


      </section>



      {/* About */}

      <section className="about shell">


        <p className="eyebrow">
          ABOUT THIS PLACE
        </p>


        <h2>
          一个人的网站，
          <br />
          应该像他的房间。
        </h2>


        <p>
          不必每件东西都有用，
          也不必每篇文章都得出结论。
          这里保存一些生活留下的痕迹，
          让时间不至于全部悄无声息地消失。
        </p>


        <p>
          网站建立于 2025 年，
          持续更新于深圳。
        </p>


        <div>
          <a href="mailto:hello@lmn516.com">
            写信
          </a>

          <a href="https://lmn516.com/feed/">
            RSS
          </a>
        </div>


      </section>



      <footer className="footer shell">

        <span>
          © 2025–2026 LMN516
        </span>

        <span>
          记录比遗忘慢一点。
        </span>


      </footer>


    </main>
  );
}
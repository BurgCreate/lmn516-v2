import Link from "next/link";
import { getPosts } from "@/lib/wordpress";

export const revalidate = 300;

export default async function HomePage() {
  const posts = await getPosts(4);

  return (
    <main>

      <div className="paper-noise" />

      <header className="site-header shell">

        <Link href="/" className="brand">
          <span className="brand-mark">LMN</span>
          <span className="brand-number">516</span>
        </Link>

        <nav className="nav">
          <Link href="/archive">周记</Link>
          <Link href="/archive">生活档案</Link>
          <Link href="/archive">长期计划</Link>
          <Link href="/about">关于</Link>
        </nav>

        <button className="theme-toggle">
          ◐
        </button>

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


          <p className="intro">
            这里是 Mo 的个人生活档案。
            记录周记、旅行、影像、音乐，
            以及一些看起来没什么用，
            但多年后一定会很珍贵的事情。
          </p>


          <div className="hero-actions">

            <Link
              href="/archive"
              className="button primary"
            >
              开始阅读
            </Link>

            <Link
              href="/archive"
              className="button ghost"
            >
              浏览档案
            </Link>

          </div>

        </div>



        <aside className="today-card">

          <p className="card-label">
            今日档案
          </p>


          <div className="date-block">

            <strong>
              07.25
            </strong>

            <span>
              星期六 · 盛夏
            </span>

          </div>


          <dl>

            <div>
              <dt>
                年度进度
              </dt>

              <dd>
                56.4%
              </dd>
            </div>


            <div>
              <dt>
                最近更新
              </dt>

              <dd>
                不如做熊猫
              </dd>
            </div>


            <div>
              <dt>
                俯卧撑
              </dt>

              <dd>
                1,833 / 10,000
              </dd>
            </div>


          </dl>


        </aside>


      </section>



      <section className="project shell section-space">


        <div className="project-copy">

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


          <Link
            href="/posts/yi-wan-ge-fu-wo-cheng"
            className="text-link"
          >
            查看完整记录 →
          </Link>


        </div>



        <div className="progress-panel">

          <div className="progress-number">

            <strong>
              1,833
            </strong>

            <span>
              / 10,000
            </span>

          </div>


          <div className="progress-track">

            <span
              style={{
                width:"18.33%"
              }}
            />

          </div>


          <div className="progress-meta">

            <span>
              已完成 18.33%
            </span>

            <span>
              剩余 8,167
            </span>

          </div>


        </div>


      </section>




      <section className="notes shell section-space">


        <div className="section-heading">

          <div>

            <p className="eyebrow">
              LATEST NOTES
            </p>


            <h2>
              最近更新
            </h2>

          </div>


          <Link
            href="/archive"
            className="text-link"
          >
            全部文章 →
          </Link>


        </div>



        {posts.length > 0 && (

          <article className="featured-post post-card">

            <div className="post-visual visual-summer">
              <span>
                盛夏
                <br />
                2026
              </span>
            </div>


            <div className="post-content">

              <p className="post-meta">
                {posts[0].date}
              </p>


              <h3>
                <Link href={`/posts/${posts[0].slug}`}>
                  {posts[0].title}
                </Link>
              </h3>


              <p>
                {posts[0].excerpt}
              </p>


              <Link
                href={`/posts/${posts[0].slug}`}
                className="text-link"
              >
                继续阅读 →
              </Link>

            </div>


          </article>

        )}



        <div className="post-grid">

          {posts.slice(1).map((post)=>(
            
            <article
              className="post-card small"
              key={post.id}
            >

              <div className="post-content">

                <p className="post-meta">
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

              </div>


            </article>

          ))}


        </div>


      </section>




      <section className="archive shell section-space">

        <div className="section-heading">

          <div>

            <p className="eyebrow">
              LIFE ARCHIVE
            </p>

            <h2>
              生活档案
            </h2>

          </div>

        </div>


        <div className="archive-grid">


          {[
            ["♫","音乐清单","100 首常听歌曲"],
            ["⌁","城市散步","公园、街道与照片"],
            ["◫","房间物品","居住空间的细节"],
            ["◎","观影档案","电影、剧集与感受"]
          ].map(([icon,title,desc])=>(

            <div
              className="archive-card"
              key={title}
            >

              <span className="archive-icon">
                {icon}
              </span>

              <strong>
                {title}
              </strong>

              <small>
                {desc}
              </small>

            </div>

          ))}


        </div>


      </section>





      <section className="about shell section-space">

        <p className="eyebrow">
          ABOUT THIS PLACE
        </p>


        <div className="about-grid">

          <h2>
            一个人的网站，
            <br />
            应该像他的房间。
          </h2>


          <div>

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


            <div className="about-links">

              <a href="mailto:hello@lmn516.com">
                写信
              </a>

              <a href="https://lmn516.com/feed/">
                RSS
              </a>

            </div>

          </div>


        </div>


      </section>




      <footer className="site-footer shell">

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
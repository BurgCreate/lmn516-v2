import Link from "next/link";
import { getPosts } from "@/lib/wordpress";

export const revalidate = 300;


function getTodayInfo() {
  const now = new Date();

  return {
    date: `${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`,
    weekday: now.toLocaleDateString("zh-CN", {
      weekday: "long"
    })
  };
}


function getYearProgress() {
  const now = new Date();

  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear() + 1, 0, 1);

  const progress =
    ((now.getTime() - start.getTime()) /
      (end.getTime() - start.getTime())) * 100;

  return progress.toFixed(1);
}


export default async function HomePage() {

  const posts = await getPosts(4);

  const featured = posts[0];

  const today = getTodayInfo();

  const yearProgress = getYearProgress();


  const cards = [
    {
      title: "寻找夏天的感觉 🍺",
      date: "2026.06.29 · 周记",
      visual: "06<br>29",
      text: "生日、时间、世界杯与夏天。27 岁的日子，继续向前。",
      color: "visual-yellow"
    },
    {
      title: "AI 时代浪潮 🌊",
      date: "2026.05.14 · 周记",
      visual: "AI<br>ERA",
      text: "网站续费、散步、旅行视频，以及这个快速变化的时代。",
      color: "visual-blue"
    },
    {
      title: "昆明游记 🌸",
      date: "2026.04.10 · 旅行",
      visual: "昆明<br>春",
      text: "第一次去云南，滇池、翠湖和一座春天很长的城市。",
      color: "visual-green"
    }
  ];


  return (

    <main id="top">

      <div
        className="paper-noise"
        aria-hidden="true"
      />


      <header className="site-header shell">

        <Link
          href="/"
          className="brand"
          aria-label="LMN516 首页"
        >

          <span className="brand-mark">
            LMN
          </span>

          <span className="brand-number">
            516
          </span>

        </Link>


        <nav className="nav">

          <a href="#notes">
            周记
          </a>

          <a href="#archive">
            生活档案
          </a>

          <a href="#project">
            长期计划
          </a>

          <a href="#about">
            关于
          </a>

        </nav>


        <button
          className="theme-toggle"
          type="button"
        >
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
            以及一些看起来没什么用、
            但多年后一定会很珍贵的事情。
          </p>


          <div className="hero-actions">

            <a
              className="button primary"
              href="#notes"
            >
              开始阅读
            </a>


            <a
              className="button ghost"
              href="#archive"
            >
              浏览档案
            </a>

          </div>


        </div>



        <aside className="today-card">


          <p className="card-label">
            今日档案
          </p>


          <div className="date-block">

            <strong>
              {today.date}
            </strong>

            <span>
              {today.weekday} · 盛夏
            </span>

          </div>


          <dl>

            <div>

              <dt>
                年度进度
              </dt>

              <dd>
                {yearProgress}%
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
      <section
        id="project"
        className="project shell section-space"
      >

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


          <a
            className="text-link"
            href="https://lmn516.com/?p=347"
          >
            查看完整记录 →
          </a>


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




      <section
        id="notes"
        className="notes shell section-space"
      >


        <div className="section-heading">


          <div>

            <p className="eyebrow">
              LATEST NOTES
            </p>

            <h2>
              最近更新
            </h2>

          </div>


          <a
            className="text-link"
            href="https://lmn516.com/"
          >
            全部文章 →
          </a>


        </div>





        {featured && (

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
                {featured.date} · 周记
              </p>


              <h3>

                <Link href={`/posts/${featured.slug}`}>
                  {featured.title}
                </Link>

              </h3>


              <p>
                {featured.excerpt}
              </p>


              <Link
                className="text-link"
                href={`/posts/${featured.slug}`}
              >
                继续阅读 →
              </Link>


            </div>


          </article>

        )}





        <div className="post-grid">


          {cards.map((card)=>(

            <article
              className="post-card small"
              key={card.title}
            >


              <div
                className={`post-visual ${card.color}`}
                dangerouslySetInnerHTML={{
                  __html: card.visual
                }}
              />


              <div className="post-content">


                <p className="post-meta">
                  {card.date}
                </p>


                <h3>
                  {card.title}
                </h3>


                <p>
                  {card.text}
                </p>


              </div>


            </article>


          ))}


        </div>



      </section>





      <section
        id="archive"
        className="archive shell section-space"
      >


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


          <a
            href="#"
            className="archive-card"
          >

            <span className="archive-icon">
              ♫
            </span>


            <strong>
              音乐清单
            </strong>


            <small>
              100 首常听歌曲
            </small>


          </a>





          <a
            href="#"
            className="archive-card"
          >

            <span className="archive-icon">
              ⌁
            </span>


            <strong>
              城市散步
            </strong>


            <small>
              公园、街道与照片
            </small>


          </a>





          <a
            href="#"
            className="archive-card"
          >

            <span className="archive-icon">
              ◫
            </span>


            <strong>
              房间物品
            </strong>


            <small>
              居住空间的细节
            </small>


          </a>





          <a
            href="#"
            className="archive-card"
          >

            <span className="archive-icon">
              ◎
            </span>


            <strong>
              观影档案
            </strong>


            <small>
              电影、剧集与感受
            </small>


          </a>


        </div>


      </section>
      <section
        id="about"
        className="about shell section-space"
      >


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
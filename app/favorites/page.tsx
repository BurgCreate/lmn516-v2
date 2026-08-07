export default function FavoritesPage() {
  const items = [
    {
      title: "音乐清单",
      desc: "收藏反复播放的声音与年度专辑。",
      tip: "持续更新",
      href: "/music",
      icon: "♫",
    },
    {
      title: "城市散步",
      desc: "记录公园、街道与路上的照片。",
      tip: "深圳与远方",
      href: "/walks",
      icon: "⌁",
    },
    {
      title: "网站搜集",
      desc: "搜集有价值的网站、工具与数字资源。",
      tip: "数字探索",
      href: "/library",
      icon: "◎",
    },
    {
      title: "观影档案",
      desc: "电影、剧集以及看完之后留下的感受。",
      tip: "不定期整理",
      href: "/movies",
      icon: "◌",
    },
  ];


  return (
    <main className="shell favorites-page">


      <section className="favorites-header">

        <p>
          生活档案 · DIGITAL GARDEN
        </p>


        <h1>
          收藏目录
        </h1>


        <span>
          把音乐、影像、散步和数字资源分别整理保存下来。
        </span>


      </section>



      <section className="favorites-grid">


        {items.map((item)=>(

          <a
            key={item.href}
            href={item.href}
            className="favorites-card"
          >

            <div className="favorites-icon">
              {item.icon}
            </div>


            <h2>
              {item.title}
            </h2>


            <p>
              {item.desc}
            </p>


            <small>
              {item.tip}
            </small>


            <b>
              →
            </b>


          </a>

        ))}


      </section>


    </main>
  );
}
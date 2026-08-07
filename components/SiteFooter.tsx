import Link from "next/link";
import { OwnerPushBinder } from "@/components/home/OwnerPushBinder";


const footerGroups = [
  {
    title: "浏览",
    links: [
      { label: "首页", href: "/" },
      { label: "文章墙", href: "/wall" },
      { label: "全部文章", href: "/posts" },
      { label: "碎碎念", href: "/moments" },
      { label: "照片墙", href: "/photos" },
    ],
  },

  {
    title: "花园",
    links: [
      { label: "音乐清单", href: "/music" },
      { label: "城市散步", href: "/walks" },
      { label: "房间物品", href: "/room" },
      { label: "观影档案", href: "/movies" },
    ],
  },

  {
    title: "关于",
    links: [
      { label: "关于本站", href: "/about" },
      { label: "生长记录", href: "/changelog" },
      { label: "网站地图", href: "/sitemap" },
      { label: "RSS", href: "/rss.xml" },
      { label: "写信", href: "mailto:hello@lmn516.com" },
    ],
  },
];


function FooterLinks({
  links,
}: {
  links: (typeof footerGroups)[number]["links"];
}) {

  return (
    <div className="footer-links">

      {links.map((link) => (

        <Link
          href={link.href}
          key={link.href}
        >
          {link.label}
        </Link>

      ))}

    </div>
  );
}



export default function SiteFooter() {

  return (

    <footer className="site-footer">


      <div
        className="site-footer-landscape"
        aria-hidden="true"
      >

        <span className="site-footer-sun" />

        <span className="site-footer-grass site-footer-grass-left" />

        <span className="site-footer-grass site-footer-grass-right" />

      </div>



      <div className="site-footer-inner shell">



        {/* 桌面导航 */}

        <div
          className="footer-map footer-map-desktop"
          aria-label="网站地图"
        >

          {footerGroups.map((group) => (

            <section
              className="footer-group"
              key={group.title}
            >

              <h3>
                {group.title}
              </h3>


              <FooterLinks
                links={group.links}
              />


            </section>

          ))}

        </div>




        {/* 手机导航 */}

        <div
          className="footer-map footer-map-mobile"
          aria-label="手机端网站地图"
        >

          {footerGroups.map((group) => (

            <details
              className="footer-group"
              key={group.title}
            >

              <summary>
                {group.title}
              </summary>


              <FooterLinks
                links={group.links}
              />


            </details>

          ))}

        </div>




        {/* 底部信息 */}

        <div className="footer-bottom">

          <span>
            © 2025–2026 LMN516
          </span>


          <span className="footer-stack">
            WordPress · Next.js · Vercel · <OwnerPushBinder />
          </span>


          <Link href="/changelog">
            当前版本 · V3.0
          </Link>


        </div>



      </div>


    </footer>

  );
}
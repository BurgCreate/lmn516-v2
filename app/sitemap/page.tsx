import type { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
  title: "网站地图 | LMN516",
  description:
    "浏览 LMN516 的文章、照片、音乐、碎碎念与其他生活档案。",
};


type SitemapLink = {
  label: string;
  href: string;
  external?: boolean;
};


type SitemapGroup = {
  title: string;
  links: SitemapLink[];
};


type SitemapSection = {
  title: string;
  groups: SitemapGroup[];
};



const sitemapSections: SitemapSection[] = [

  {
    title: "探索 LMN516",

    groups: [

      {
        title: "主要页面",

        links: [
          {
            label: "首页",
            href: "/",
          },
          {
            label: "关于本站",
            href: "/about",
          },
          {
            label: "生长记录",
            href: "/changelog",
          },
          {
            label: "网站地图",
            href: "/sitemap",
          },
        ],
      },


      {
        title: "文字",

        links: [
          {
            label: "全部文章",
            href: "/posts",
          },
          {
            label: "文章归档",
            href: "/archive",
          },
          {
            label: "碎碎念",
            href: "/moments",
          },
        ],
      },


      {
        title: "生活档案",

        links: [
          {
            label: "照片墙",
            href: "/photos",
          },
          {
            label: "音乐清单",
            href: "/music",
          },
          {
            label: "城市散步",
            href: "/walks",
          },
          {
            label: "观影档案",
            href: "/movies",
          },
          {
            label: "房间物品",
            href: "/room",
          },
        ],
      },

    ],
  },



  {
    title: "花园入口",

    groups: [

      {
        title: "首页专题",

        links: [
          {
            label: "本期",
            href: "/#notes",
          },
          {
            label: "专题",
            href: "/#project",
          },
          {
            label: "收藏",
            href: "/#archive",
          },
          {
            label: "关于",
            href: "/#about",
          },
        ],
      },


      {
        title: "订阅与联系",

        links: [
          {
            label: "RSS",
            href: "https://lmn516.com/feed/",
            external: true,
          },
          {
            label: "写信",
            href: "mailto:hello@lmn516.com",
            external: true,
          },
        ],
      },

    ],
  },

];



export default function SitemapPage() {

  return (

    <main className="sitemap-page shell">


      <header className="sitemap-hero">


        <p className="eyebrow">
          LMN516 DIRECTORY
        </p>


        <h1>
          网站地图
        </h1>


        <p>
          这里收录了目前开放的页面。沿着目录走，可以找到这座数字花园里已经长出来的内容。
        </p>


      </header>





      <div className="sitemap-sections">


        {sitemapSections.map((section)=>(


          <section
            className="sitemap-section"
            key={section.title}
          >


            <h2>
              {section.title}
            </h2>



            <div className="sitemap-grid">


              {section.groups.map((group)=>(


                <div
                  className="sitemap-group"
                  key={group.title}
                >


                  <h3>
                    {group.title}
                  </h3>



                  <ul>


                    {group.links.map((link)=>(


                      <li
                        key={`${group.title}-${link.href}`}
                      >


                        <Link
                          href={link.href}
                          target={
                            link.external
                              ? "_blank"
                              : undefined
                          }
                          rel={
                            link.external
                              ? "noreferrer"
                              : undefined
                          }
                        >

                          {link.label}

                        </Link>


                      </li>


                    ))}


                  </ul>


                </div>


              ))}


            </div>


          </section>


        ))}


      </div>


    </main>

  );

}
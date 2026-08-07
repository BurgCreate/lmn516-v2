import type { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
  title: "导航 | LMN516",
  description:
    "浏览 LMN516 的周记、碎碎念、相片、收藏夹与其他生活档案。",
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
    title: "生活",

    groups: [

      {
        title: "",

        links: [
          {
            label: "周记",
            href: "/wall",
          },
          {
            label: "碎碎念",
            href: "/moments",
          },
          {
            label: "相片",
            href: "/photos",
          },
          {
            label: "收藏夹",
            href: "/favorites",
          },
        ],
      },

    ],
  },


  {
    title: "兴趣",

    groups: [

      {
        title: "",

        links: [
          {
            label: "网站搜集",
            href: "/library",
          },
          {
            label: "音乐清单",
            href: "/music",
          },
          {
            label: "观影档案",
            href: "/movies",
          },
          {
            label: "城市散步",
            href: "/walks",
          },
          {
            label: "房间物品",
            href: "/room",
          },
          {
            label: "花园游戏",
            href: "/games/garden-match",
          },
        ],
      },

    ],
  },


  {
    title: "档案",

    groups: [

      {
        title: "",

        links: [
          {
            label: "全部文章",
            href: "/posts",
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
            label: "RSS",
            href: "/rss.xml",
          },
          {
            label: "写信",
            href: "mailto:hello@lmn516.com",
            external: true,
          },
          {
            label: "导航",
            href: "/sitemap",
          },
        ],
      },

    ],
  },

];



export default function SitemapPage() {

  return (

    <main className="sitemap-page shell">


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
                  key={group.title || section.title}
                >


                  {group.title && (
                    <h3>
                      {group.title}
                    </h3>
                  )}



                  <ul>


                    {group.links.map((link)=>(


                      <li
                        key={`${section.title}-${link.href}`}
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
import { NextResponse } from "next/server";

const SITE_URL = "https://lmn516.com";
const WP_API = "https://cms.lmn516.com/wp-json/wp/v2/posts";


function escapeXml(str: string = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


export async function GET() {

  let posts = [];

  try {

    const res = await fetch(
      `${WP_API}?per_page=20&_embed=1`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );


    if (res.ok) {
      posts = await res.json();
    }


  } catch (error) {

    console.error(
      "RSS fetch error",
      error
    );

  }



  const items = posts
    .map(
      (post: any) => `

<item>

<title>
${escapeXml(post.title.rendered)}
</title>


<link>
${SITE_URL}/posts/${post.slug}
</link>


<guid>
${SITE_URL}/posts/${post.slug}
</guid>


<description>
<![CDATA[
${post.excerpt.rendered}
]]>
</description>


<pubDate>
${new Date(post.date).toUTCString()}
</pubDate>


</item>

`
    )
    .join("");




  const xml = `<?xml version="1.0" encoding="UTF-8"?>

<rss version="2.0">

<channel>


<title>
LMN516 数字花园
</title>


<link>
${SITE_URL}
</link>


<description>
一个持续生长的个人数字花园
</description>


<language>
zh-CN
</language>


${items}


</channel>

</rss>`;




  return new NextResponse(
    xml,
    {
      headers: {
        "Content-Type":
          "application/xml; charset=utf-8",
      },
    }
  );

}
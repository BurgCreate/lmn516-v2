import { NextResponse } from "next/server";

const SITE_URL = "https://lmn516.com";

const WP_API =
  "https://cms.lmn516.com/wp-json/wp/v2/posts";


// 只读取「周记」分类
// WordPress 分类 ID = 1
const CATEGORY_ID = 1;


function escapeXml(str: string = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


// 标题处理
function getTitle(post: any) {

  if (post.title?.rendered) {
    return post.title.rendered;
  }


  if (post.content?.rendered) {

    return post.content.rendered
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 50);

  }


  return "LMN516 周记更新";

}




export async function GET() {

  let posts = [];


  try {

    const res = await fetch(
      `${WP_API}?per_page=100&categories=${CATEGORY_ID}`,
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
      "RSS fetch error:",
      error
    );

  }




  const items = posts
    .map(
      (post: any) => `

<item>

<title>
${escapeXml(getTitle(post))}
</title>


<link>
${SITE_URL}/posts/${post.id}
</link>


<guid>
${SITE_URL}/posts/${post.id}
</guid>


<description>
<![CDATA[
${post.excerpt?.rendered || ""}
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
LMN516 数字花园 · 周记
</title>


<link>
${SITE_URL}
</link>


<description>
LMN516 两周一次的周记更新
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
export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string | null;
};

const WP_URL =
  process.env.WORDPRESS_URL ||
  "https://cms.lmn516.com";


const fallbackPosts: Post[] = [
  {
    id: 1553,
    slug: "bu-ru-zuo-xiong-mao",
    title: "不如做熊猫🐼",
    excerpt:
      "关于世界杯、天气、AI、生活风险和一碗牛肉面的随想。",
    content:
      "<p>这是一篇来自 WordPress 的示例文章。连接成功后，这里会自动显示你的真实正文。</p>",
    date: "2026.07.13",
    image: null,
  },
  {
    id: 1537,
    slug: "xun-zhao-xia-tian-de-gan-jue",
    title: "寻找夏天的感觉🍺",
    excerpt:
      "在日常生活里寻找季节变化留下来的细小证据。",
    content:
      "<p>连接成功后，这里会自动显示你的真实正文。</p>",
    date: "2026.06.29",
    image: null,
  },
  {
    id: 347,
    slug: "yi-wan-ge-fu-wo-cheng",
    title: "一万个俯卧撑💪，已完成1833个",
    excerpt:
      "一个长期进行中的身体计划，也是关于耐心的记录。",
    content:
      "<p>连接成功后，这里会自动显示你的真实正文。</p>",
    date: "2026.02.16",
    image: null,
  },
];


function cleanHtml(input: string) {
  return input
    .replace(/<[^>]+>/g, "")
    .replace(/\[&hellip;\]/g, "…")
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;|&#8221;/g, "“")
    .trim();
}


function formatDate(input: string) {
  const date = new Date(input);

  if (Number.isNaN(date.getTime())) {
    return input;
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replaceAll("/", ".");
}


/**
 * 从文章正文中获取第一张图片。
 *
 * 如果文章没有设置“特色图片”，
 * 就自动使用正文中的第一张图片作为封面。
 */
function getFirstContentImage(
  content: string
): string | null {
  if (!content) return null;

  const match = content.match(
    /<img[^>]+src=["']([^"']+)["']/i
  );

  return match?.[1] || null;
}


/**
 * 获取文章封面。
 *
 * 优先使用 WordPress 特色图片，
 * 没有特色图片时使用正文第一张图片。
 */
function getPostImage(item: any): string | null {
  const featuredImage =
    item._embedded?.[
      "wp:featuredmedia"
    ]?.[0]?.source_url;

  if (featuredImage) {
    return featuredImage;
  }

  return getFirstContentImage(
    item.content?.rendered || ""
  );
}


function formatPost(item: any): Post {
  return {
    id: item.id,

    slug: item.slug,

    title: cleanHtml(
      item.title?.rendered || ""
    ),

    excerpt: cleanHtml(
      item.excerpt?.rendered || ""
    ).slice(0, 120),

    content:
      item.content?.rendered || "",

    date: formatDate(item.date),

    image: getPostImage(item),
  };
}


// 获取文章列表
export async function getPosts(
  limit = 8
): Promise<Post[]> {
  try {
    const response = await fetch(
      `${WP_URL}/index.php?rest_route=/wp/v2/posts&per_page=${Math.min(
        limit,
        100
      )}&_embed=1`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "WordPress API unavailable"
      );
    }

    const data = await response.json();

    return data.map(formatPost);
  } catch (error) {
    console.error(
      "WordPress 获取失败:",
      error
    );

    return fallbackPosts.slice(0, limit);
  }
}


// 根据 slug 获取单篇文章
export async function getPostBySlug(
  slug: string
): Promise<Post | null> {
  try {
    const response = await fetch(
      `${WP_URL}/index.php?rest_route=/wp/v2/posts&slug=${encodeURIComponent(
        slug
      )}&_embed=1`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "WordPress API unavailable"
      );
    }

    const data = await response.json();

    const item = data[0];

    if (!item) {
      return (
        fallbackPosts.find(
          (post) => post.slug === slug
        ) || null
      );
    }

    return formatPost(item);
  } catch (error) {
    console.error(
      "WordPress 单篇获取失败:",
      error
    );

    return (
      fallbackPosts.find(
        (post) => post.slug === slug
      ) || null
    );
  }
}


// 根据文章 ID 获取单篇文章
export async function getPostById(
  id: number
): Promise<Post | null> {
  try {
    const response = await fetch(
      `${WP_URL}/index.php?rest_route=/wp/v2/posts/${id}&_embed=1`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "WordPress API unavailable"
      );
    }

    const item = await response.json();

    return formatPost(item);
  } catch (error) {
    console.error(
      "WordPress 按 ID 获取失败:",
      error
    );

    return (
      fallbackPosts.find(
        (post) => post.id === id
      ) || null
    );
  }
}
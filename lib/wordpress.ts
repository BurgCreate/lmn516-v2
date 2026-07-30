export type PostFormat =
  | "standard"
  | "aside"
  | "chat"
  | "gallery"
  | "link"
  | "image"
  | "quote"
  | "status"
  | "video"
  | "audio";

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string | null;
  format: PostFormat;
};

export type Moment = {
  id: number;
  content: string;
  date: string;
  image: string | null;
  format: PostFormat;
};

const WP_URL =
  process.env.WORDPRESS_URL ||
  "https://cms.lmn516.com";

const MOMENTS_CATEGORY_SLUG = "moments";


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
    format: "standard",
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
    format: "standard",
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
    format: "standard",
  },
];


const fallbackMoments: Moment[] = [];


/**
 * 清理 HTML 标签和常见字符实体。
 */
function cleanHtml(input: string) {
  return input
    .replace(/<[^>]+>/g, "")
    .replace(/\[&hellip;\]/g, "…")
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;|&#8221;/g, "“")
    .trim();
}


/**
 * 格式化正式文章日期。
 *
 * 输出示例：
 * 2026.07.26
 */
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
 * 格式化碎碎念时间。
 *
 * 输出示例：
 * 7月26日 18:42
 */
function formatMomentDate(input: string) {
  const date = new Date(input);

  if (Number.isNaN(date.getTime())) {
    return input;
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();

  const timePart = new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${month}月${day}日 ${timePart}`;
}


/**
 * 从文章正文中获取第一张图片。
 *
 * 如果文章没有设置特色图片，
 * 就自动使用正文中的第一张图片。
 */
function getFirstContentImage(
  content: string
): string | null {
  if (!content) {
    return null;
  }

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


/**
 * 规范化 WordPress 文章形式。
 *
 * WordPress 普通文章通常返回 standard；
 * 未知值也安全回退为 standard。
 */
function normalizePostFormat(input: unknown): PostFormat {
  const formats: PostFormat[] = [
    "standard",
    "aside",
    "chat",
    "gallery",
    "link",
    "image",
    "quote",
    "status",
    "video",
    "audio",
  ];

  return typeof input === "string" &&
    formats.includes(input as PostFormat)
    ? (input as PostFormat)
    : "standard";
}


/**
 * 将 WordPress 返回的数据格式化为正式文章。
 */
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

    format: normalizePostFormat(item.format),
  };
}


/**
 * 将 WordPress 返回的数据格式化为碎碎念。
 *
 * 前台不显示标题，只使用正文、时间和图片。
 */
function formatMoment(item: any): Moment {
  return {
    id: item.id,

    content:
      item.content?.rendered || "",

    date: formatMomentDate(item.date),

    image: getPostImage(item),

    format: normalizePostFormat(item.format),
  };
}


/**
 * 根据分类别名获取 WordPress 分类 ID。
 *
 * 例如：
 * moments → 对应的数字分类 ID
 */
async function getCategoryId(
  slug: string
): Promise<number | null> {
  try {
    const response = await fetch(
      `${WP_URL}/index.php?rest_route=/wp/v2/categories&slug=${encodeURIComponent(
        slug
      )}`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "WordPress category API unavailable"
      );
    }

    const data = await response.json();

    return data[0]?.id || null;
  } catch (error) {
    console.error(
      `WordPress 分类获取失败：${slug}`,
      error
    );

    return null;
  }
}


/**
 * 获取正式文章列表。
 *
 * 自动排除“碎碎念”分类中的内容。
 */
export async function getPosts(
  limit = 8
): Promise<Post[]> {
  try {
    const momentsCategoryId =
      await getCategoryId(
        MOMENTS_CATEGORY_SLUG
      );

    const excludeMoments =
      momentsCategoryId
        ? `&categories_exclude=${momentsCategoryId}`
        : "";

    const response = await fetch(
      `${WP_URL}/index.php?rest_route=/wp/v2/posts&per_page=${Math.min(
        limit,
        100
      )}&_embed=1${excludeMoments}`,
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


/**
 * 获取碎碎念列表。
 *
 * 只读取 moments 分类中的内容。
 */
export async function getMoments(
  limit = 20
): Promise<Moment[]> {
  try {
    const momentsCategoryId =
      await getCategoryId(
        MOMENTS_CATEGORY_SLUG
      );

    if (!momentsCategoryId) {
      console.error(
        "没有找到 moments 分类"
      );

      return fallbackMoments;
    }

    const response = await fetch(
      `${WP_URL}/index.php?rest_route=/wp/v2/posts&categories=${momentsCategoryId}&per_page=${Math.min(
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
        "WordPress moments API unavailable"
      );
    }

    const data = await response.json();

    return data.map(formatMoment);
  } catch (error) {
    console.error(
      "WordPress 碎碎念获取失败:",
      error
    );

    return fallbackMoments;
  }
}


/**
 * 获取最新一条碎碎念。
 *
 * 这个方法专门给推送接口使用，因此不走缓存。
 * 发布后立即点击“推送最新碎碎念”时，可以拿到刚发布的内容。
 */
export async function getLatestMomentFresh(): Promise<Moment | null> {
  try {
    const momentsCategoryId = await getCategoryId(MOMENTS_CATEGORY_SLUG);

    if (!momentsCategoryId) {
      return null;
    }

    const response = await fetch(
      `${WP_URL}/index.php?rest_route=/wp/v2/posts&categories=${momentsCategoryId}&per_page=1&_embed=1&_=${Date.now()}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("WordPress latest moment API unavailable");
    }

    const data = await response.json();
    const item = data[0];

    return item ? formatMoment(item) : null;
  } catch (error) {
    console.error("WordPress 最新碎碎念获取失败:", error);
    return null;
  }
}


/**
 * 根据 slug 获取单篇正式文章。
 */
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


/**
 * 根据文章 ID 获取单篇正式文章。
 */
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

export type MediaImage = {
  id: number;
  sourceUrl: string;
  alt: string;
  caption: string;
  date: string;
};

export async function getMediaImages(
  count = 100
): Promise<MediaImage[]> {
  try {
    const response = await fetch(
      `${WP_URL}/index.php?rest_route=/wp/v2/media&media_type=image&per_page=${Math.min(
        count,
        100
      )}`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "WordPress 媒体库 API unavailable"
      );
    }

    const media = await response.json();

    return media
      .filter(
        (item: any) =>
          typeof item.source_url === "string" &&
          item.source_url.length > 0
      )
      .map((item: any) => ({
        id: item.id,
        sourceUrl: item.source_url,
        alt:
          cleanHtml(item.alt_text || "") ||
          "生活照片",
        caption: cleanHtml(
          item.caption?.rendered || ""
        ),
        date: formatDate(item.date),
      }));
  } catch (error) {
    console.error(
      "WordPress 媒体库获取失败:",
      error
    );

    return [];
  }
}
/**
 * 获取全部正式文章。
 *
 * WordPress REST API 单次最多返回 100 篇，因此这里按页读取，
 * 直到最后一页。文章墙使用这个方法，首页仍继续使用 getPosts。
 */
export async function getAllPosts(): Promise<Post[]> {
  try {
    const momentsCategoryId = await getCategoryId(MOMENTS_CATEGORY_SLUG);
    const excludeMoments = momentsCategoryId
      ? `&categories_exclude=${momentsCategoryId}`
      : "";

    const allPosts: Post[] = [];
    const perPage = 100;
    let page = 1;
    let totalPages = 1;

    do {
      const response = await fetch(
        `${WP_URL}/index.php?rest_route=/wp/v2/posts&per_page=${perPage}&page=${page}&_embed=1${excludeMoments}`,
        {
          next: {
            revalidate: 300,
          },
        }
      );

      if (!response.ok) {
        throw new Error("WordPress all posts API unavailable");
      }

      const data = await response.json();
      allPosts.push(...data.map(formatPost));

      totalPages = Number(response.headers.get("X-WP-TotalPages") || "1");
      page += 1;
    } while (page <= totalPages);

    return allPosts;
  } catch (error) {
    console.error("WordPress 全部文章获取失败:", error);
    return fallbackPosts;
  }
}

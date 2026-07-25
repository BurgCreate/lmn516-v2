type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
};

const WP_URL = process.env.WORDPRESS_URL || "https://lmn516.com";

const fallbackPosts: Post[] = [
  {
    id: 1,
    slug: "bu-ru-zuo-xiong-mao",
    title: "不如做熊猫",
    excerpt: "关于世界杯、天气、AI、生活风险和一碗牛肉面的随想。",
    content: "<p>这是一篇来自 WordPress 的示例文章。连接成功后，这里会自动显示你的真实正文。</p>",
    date: "2026.07.13"
  },
  {
    id: 2,
    slug: "xun-zhao-xia-tian",
    title: "寻找夏天的感觉",
    excerpt: "在日常生活里寻找季节变化留下来的细小证据。",
    content: "<p>连接成功后，这里会自动显示你的真实正文。</p>",
    date: "2026.06.29"
  },
  {
    id: 3,
    slug: "yi-wan-ge-fu-wo-cheng",
    title: "一万个俯卧撑",
    excerpt: "一个长期进行中的身体计划，也是关于耐心的记录。",
    content: "<p>连接成功后，这里会自动显示你的真实正文。</p>",
    date: "2026.02.16"
  }
];

function cleanHtml(input: string) {
  return input
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;|&#8221;/g, "“")
    .trim();
}

function formatDate(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date).replaceAll("/", ".");
}

export async function getPosts(limit = 8): Promise<Post[]> {
  try {
    const response = await fetch(
      `${WP_URL}/wp-json/wp/v2/posts?per_page=${Math.min(limit, 100)}&_fields=id,slug,date,title,excerpt,content`,
      { next: { revalidate: 300 } }
    );
    if (!response.ok) throw new Error("WordPress API unavailable");
    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id,
      slug: item.slug,
      title: cleanHtml(item.title.rendered),
      excerpt: cleanHtml(item.excerpt.rendered).slice(0, 120),
      content: item.content.rendered,
      date: formatDate(item.date)
    }));
  } catch {
    return fallbackPosts.slice(0, limit);
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(
      `${WP_URL}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_fields=id,slug,date,title,excerpt,content`,
      { next: { revalidate: 300 } }
    );
    if (!response.ok) throw new Error("WordPress API unavailable");
    const [item] = await response.json();
    if (!item) return fallbackPosts.find((post) => post.slug === slug) || null;
    return {
      id: item.id,
      slug: item.slug,
      title: cleanHtml(item.title.rendered),
      excerpt: cleanHtml(item.excerpt.rendered).slice(0, 120),
      content: item.content.rendered,
      date: formatDate(item.date)
    };
  } catch {
    return fallbackPosts.find((post) => post.slug === slug) || null;
  }
}

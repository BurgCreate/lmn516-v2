import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/wordpress";

const BASE_URL = "https://lmn516.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts(100);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/archive`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/moments`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/music`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/photos`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/changelog`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...postPages];
}

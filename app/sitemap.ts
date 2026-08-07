import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {

  const base = "https://lmn516.com";

  return [
    "/",
    "/about",
    "/changelog",
    "/favorites",
    "/games/garden-match",
    "/library",
    "/moments",
    "/movies",
    "/music",
    "/photos",
    "/posts",
    "/room",
    "/walks",
    "/wall",
    "/sitemap",
  ].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));

}
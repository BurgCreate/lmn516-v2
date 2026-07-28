import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LMN516",
    short_name: "LMN516",
    description: "Mo 的个人生活档案，记录周记、旅行、影像、音乐与长期计划。",
    start_url: "/pwa-test",
    display: "standalone",
    background_color: "#f2efe7",
    theme_color: "#f2efe7",
    lang: "zh-CN",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
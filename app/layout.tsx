import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

import PageTransitionReset from "@/components/PageTransitionReset";
import { GardenWorldLayer } from "@/components/garden";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MomentBubble from "@/components/MomentBubble";


export const metadata: Metadata = {
  title: {
    default: "LMN516",
    template: "%s · LMN516"
  },
  description:
    "Mo 的个人生活档案，记录周记、旅行、影像、音乐与长期计划。",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "LMN516",
    statusBarStyle: "default"
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png"
  }
};


export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="zh-CN">
      <body>

        <PageTransitionReset />

        <GardenWorldLayer />

        <SiteHeader />

        <main>
          {children}
        </main>

        <SiteFooter />

        <MomentBubble
          content="留下你的花园记忆"
          date="LMN516"
        />

        <Analytics />

      </body>
    </html>
  );
}
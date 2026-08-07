import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

import PageTransitionReset from "@/components/PageTransitionReset";
import { GardenWorldLayer } from "@/components/garden";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MomentBubble from "@/components/MomentBubble";

import { getMoments } from "@/lib/wordpress";


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


export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {

  const moments = await getMoments(1);

  const latestMoment = moments[0];


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


        {latestMoment && (
          <MomentBubble
            content={latestMoment.content}
            date={latestMoment.date}
          />
        )}


        <Analytics />

      </body>

    </html>
  );
}
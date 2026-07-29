import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import PageTransitionReset from "@/components/PageTransitionReset";
import DaisyCursorPhysics from "@/components/DaisyCursorPhysics";

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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <PageTransitionReset />
        <DaisyCursorPhysics />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
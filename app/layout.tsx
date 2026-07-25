import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LMN516",
    template: "%s · LMN516"
  },
  description: "Mo 的个人生活档案，记录周记、旅行、影像、音乐与长期计划。"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

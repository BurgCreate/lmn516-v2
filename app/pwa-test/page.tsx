import type { Metadata } from "next";
import Link from "next/link";
import PwaTestPanel from "@/components/PwaTestPanel";

export const metadata: Metadata = {
  title: "PWA 通知测试",
  description: "测试 LMN516 在 iPhone 主屏幕 Web App 中接收真实 Web Push 通知。"
};

export default function PwaTestPage() {
  return (
    <main className="pwa-test-page">
      <div className="pwa-test-shell">
        <Link href="/" className="pwa-test-back">
          ← 返回 LMN516
        </Link>
        <p className="pwa-test-eyebrow">LMN516 LAB</p>
        <h1>PWA 通知测试</h1>
        <p className="pwa-test-intro">
          先让这台 iPhone 成为 LMN516 的第一台测试设备。这里发送的是服务器 Web Push，
          不是页面自己弹出来哄人的通知。
        </p>
        <PwaTestPanel />
      </div>
    </main>
  );
}

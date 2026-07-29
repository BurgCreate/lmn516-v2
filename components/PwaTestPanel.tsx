"use client";

import { useEffect, useState } from "react";

type Status = "idle" | "working" | "success" | "error";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((character) => character.charCodeAt(0))
  );
}

function isStandaloneMode() {
  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

export default function PwaTestPanel() {
  const [supported, setSupported] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  const [permission, setPermission] = useState<
    NotificationPermission | "unsupported"
  >("default");

  const [subscription, setSubscription] =
    useState<PushSubscription | null>(null);

  const [status, setStatus] = useState<Status>("idle");

  const [message, setMessage] = useState(
    "正在检查这台设备是否支持 Web Push……"
  );

  useEffect(() => {
    const browserSupported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    setSupported(browserSupported);

    if (!browserSupported) {
      setPermission("unsupported");
      setMessage(
        "当前浏览器不支持这套 Web Push 测试。请确认使用较新的 iPhone 系统，并从主屏幕 App 打开。"
      );
      return;
    }

    const standalone = isStandaloneMode();

    setIsStandalone(standalone);
    setPermission(Notification.permission);

    if (standalone) {
      setMessage("已从主屏幕 App 打开，现在可以点击“开启通知”。");
    } else {
      setMessage(
        "先把网站添加到 iPhone 主屏幕，再从桌面图标打开。"
      );
    }

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) =>
        registration.pushManager.getSubscription()
      )
      .then((existingSubscription) => {
        setSubscription(existingSubscription);

        if (existingSubscription) {
          setMessage(
            "这台设备已经订阅通知，现在可以发送测试通知。"
          );
        }
      })
      .catch((error) => {
        console.error(error);
        setStatus("error");
        setMessage("Service Worker 注册失败，请关闭 App 后重新打开。");
      });
  }, []);

  async function enableNotifications() {
    if (!supported) {
      setStatus("error");
      setMessage("当前设备暂时没有检测到 Web Push 支持。");
      return;
    }

    if (
      !isStandaloneMode() &&
      /iPhone|iPad|iPod/i.test(navigator.userAgent)
    ) {
      setStatus("error");
      setMessage(
        "iPhone 必须先把 LMN516 添加到主屏幕，并从桌面图标打开后才能开启通知。"
      );
      return;
    }

    const publicKey =
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!publicKey) {
      setStatus("error");
      setMessage(
        "网站尚未读取到 VAPID 公钥，请检查 Vercel 环境变量并重新部署。"
      );
      return;
    }

    setStatus("working");
    setMessage("正在请求通知权限……");

    try {
      const result =
        await Notification.requestPermission();

      setPermission(result);

      if (result !== "granted") {
        setStatus("error");
        setMessage(
          "通知权限没有开启。请前往 iPhone 设置 → 通知 → LMN516 检查权限。"
        );
        return;
      }

      const registration =
        await navigator.serviceWorker.ready;

      const currentSubscription =
        await registration.pushManager.getSubscription();

      const nextSubscription =
        currentSubscription ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            urlBase64ToUint8Array(publicKey)
        }));

      setSubscription(nextSubscription);
      setStatus("success");
      setMessage(
        "通知已经开启。现在可以发送一条 5 秒后到达的真实服务器推送。"
      );
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(
        "开启通知失败。请确认通过 HTTPS 打开，并从主屏幕 App 运行。"
      );
    }
  }

  async function sendLatestMomentPush() {
    if (!subscription) {
      setStatus("error");
      setMessage("请先开启通知。");
      return;
    }

    setStatus("working");
    setMessage("正在读取 WordPress 最新一条碎碎念并发送到这台手机……");

    try {
      const response = await fetch("/api/push/moment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          subscription: subscription.toJSON()
        })
      });

      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        momentId?: number;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "碎碎念推送失败。");
      }

      setStatus("success");
      setMessage(
        `最新碎碎念已经发送${result.momentId ? `（ID ${result.momentId}）` : ""}。现在可以退出到主屏幕查看通知。`
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "碎碎念推送失败。"
      );
    }
  }

  async function sendTestPush() {
    if (!subscription) {
      setStatus("error");
      setMessage("请先开启通知。");
      return;
    }

    setStatus("working");
    setMessage(
      "服务器将在约 5 秒后发送。现在可以退出到主屏幕或锁定 iPhone。"
    );

    try {
      const response = await fetch("/api/push/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          delaySeconds: 5
        })
      });

      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(
          result.error || "推送发送失败。"
        );
      }

      setStatus("success");
      setMessage(
        "服务器已完成发送。如果没有出现通知，请检查 iPhone 通知设置和专注模式。"
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "推送发送失败。"
      );
    }
  }

  return (
    <section
      className="pwa-test-panel"
      aria-live="polite"
    >
      <div className="pwa-status-grid">
        <div className="pwa-status-card">
          <span>运行方式</span>
          <strong>
            {isStandalone
              ? "主屏幕 App"
              : "普通浏览器"}
          </strong>
        </div>

        <div className="pwa-status-card">
          <span>通知权限</span>
          <strong>
            {permission === "granted"
              ? "已允许"
              : permission === "denied"
                ? "已拒绝"
                : permission === "unsupported"
                  ? "不支持"
                  : "未请求"}
          </strong>
        </div>

        <div className="pwa-status-card">
          <span>推送订阅</span>
          <strong>
            {subscription
              ? "已订阅"
              : "未订阅"}
          </strong>
        </div>
      </div>

      <div
        className={`pwa-test-message pwa-test-message-${status}`}
      >
        {message}
      </div>

      <div className="pwa-test-actions">
        <button
          type="button"
          onClick={enableNotifications}
          disabled={status === "working"}
        >
          {subscription
            ? "重新检查通知"
            : "开启通知"}
        </button>

        <button
          type="button"
          onClick={sendLatestMomentPush}
          disabled={
            !subscription ||
            status === "working"
          }
        >
          推送最新碎碎念
        </button>

        <button
          type="button"
          onClick={sendTestPush}
          disabled={
            !subscription ||
            status === "working"
          }
        >
          5 秒后发送测试通知
        </button>
      </div>

      <details className="pwa-test-help">
        <summary>iPhone 安装步骤</summary>

        <ol>
          <li>
            使用 Safari 打开
            lmn516.com/pwa-test。
          </li>
          <li>
            点击分享按钮，再选择“添加到主屏幕”。
          </li>
          <li>
            退出 Safari，从桌面的 LMN516 图标重新打开。
          </li>
          <li>
            点击“开启通知”，并允许系统通知。
          </li>
          <li>
            点击测试按钮后退出到主屏幕，约 5 秒后查看通知。
          </li>
        </ol>
      </details>
    </section>
  );
}
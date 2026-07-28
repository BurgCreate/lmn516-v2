"use client";

import { useEffect, useState } from "react";

type Status = "idle" | "working" | "success" | "error";

function normalizePublicKey(value: string) {
  return value
    .trim()
    .replace(/^NEXT_PUBLIC_VAPID_PUBLIC_KEY\s*=\s*/i, "")
    .replace(/^['"]|['"]$/g, "")
    .replace(/\s+/g, "");
}

function urlBase64ToUint8Array(base64String: string) {
  const normalized = normalizePublicKey(base64String);
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  const base64 = (normalized + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const output = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    output[i] = rawData.charCodeAt(i);
  }

  if (output.length !== 65 || output[0] !== 4) {
    throw new Error(`VAPID 公钥无效：解码后为 ${output.length} 字节。`);
  }

  return output;
}

function arraysEqual(a: ArrayBuffer | null, b: Uint8Array) {
  if (!a) return false;
  const left = new Uint8Array(a);
  if (left.length !== b.length) return false;
  return left.every((value, index) => value === b[index]);
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
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("正在检查这台设备是否支持 Web Push……");

  useEffect(() => {
    const browserSupported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    setSupported(browserSupported);

    if (!browserSupported) {
      setPermission("unsupported");
      setMessage("当前浏览器不支持 Web Push。请从 iPhone 主屏幕 App 打开。");
      return;
    }

    const standalone = isStandaloneMode();
    setIsStandalone(standalone);
    setPermission(Notification.permission);

    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then(async (registration) => {
        await registration.update();
        return registration.pushManager.getSubscription();
      })
      .then((existingSubscription) => {
        setSubscription(existingSubscription);
        setMessage(
          existingSubscription
            ? "检测到旧订阅。点击开启通知时会自动校验并修复。"
            : standalone
              ? "已从主屏幕 App 打开，现在可以点击开启通知。"
              : "请先添加到主屏幕，再从桌面图标打开。"
        );
      })
      .catch((error) => {
        console.error(error);
        setStatus("error");
        setMessage(`Service Worker 注册失败：${error instanceof Error ? error.message : String(error)}`);
      });
  }, []);

  async function enableNotifications() {
    if (!supported) {
      setStatus("error");
      setMessage("当前设备没有检测到 Web Push 支持。");
      return;
    }

    if (!isStandaloneMode() && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      setStatus("error");
      setMessage("iPhone 必须从主屏幕 LMN516 图标打开。 ");
      return;
    }

    setStatus("working");

    try {
      setMessage("步骤 1/5：正在读取公钥……");
      const keyResponse = await fetch("/api/push/public-key", { cache: "no-store" });
      const keyResult = (await keyResponse.json()) as {
        ok?: boolean;
        publicKey?: string;
        error?: string;
      };

      if (!keyResponse.ok || !keyResult.publicKey) {
        throw new Error(keyResult.error || "读取公钥失败。 ");
      }

      const applicationServerKey = urlBase64ToUint8Array(keyResult.publicKey);

      setMessage("步骤 2/5：正在请求通知权限……");
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== "granted") {
        throw new Error("通知权限没有开启。请在 iPhone 设置中允许 LMN516 通知。 ");
      }

      setMessage("步骤 3/5：正在检查 Service Worker……");
      const registration = await navigator.serviceWorker.ready;
      await registration.update();

      setMessage("步骤 4/5：正在检查旧订阅……");
      let currentSubscription = await registration.pushManager.getSubscription();

      if (
        currentSubscription &&
        !arraysEqual(currentSubscription.options.applicationServerKey, applicationServerKey)
      ) {
        await currentSubscription.unsubscribe();
        currentSubscription = null;
      }

      setMessage("步骤 5/5：正在建立新订阅……");
      const nextSubscription =
        currentSubscription ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey.buffer.slice(
            applicationServerKey.byteOffset,
            applicationServerKey.byteOffset + applicationServerKey.byteLength
          )
        }));

      setSubscription(nextSubscription);
      setStatus("success");
      setMessage("通知已经开启。现在可以发送测试通知。 ");
    } catch (error) {
      console.error(error);
      setStatus("error");
      const name = error instanceof DOMException ? error.name : "Error";
      const detail = error instanceof Error ? error.message : String(error);
      setMessage(`开启通知失败 [${name}]：${detail}`);
    }
  }

  async function sendTestPush() {
    if (!subscription) {
      setStatus("error");
      setMessage("请先开启通知。 ");
      return;
    }

    setStatus("working");
    setMessage("服务器将在约 5 秒后发送通知。 ");

    try {
      const response = await fetch("/api/push/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          delaySeconds: 5
        })
      });

      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "推送发送失败。 ");
      }

      setStatus("success");
      setMessage("服务器已发送。请退出到主屏幕或锁定 iPhone 查看通知。 ");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "推送发送失败。 ");
    }
  }

  return (
    <section className="pwa-test-panel" aria-live="polite">
      <div className="pwa-status-grid">
        <div className="pwa-status-card">
          <span>运行方式</span>
          <strong>{isStandalone ? "主屏幕 App" : "普通浏览器"}</strong>
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
          <strong>{subscription ? "已订阅" : "未订阅"}</strong>
        </div>
      </div>

      <p className={`pwa-test-message pwa-test-message-${status}`}>{message}</p>

      <div className="pwa-test-actions">
        <button type="button" onClick={enableNotifications} disabled={status === "working"}>
          开启通知
        </button>
        <button
          type="button"
          onClick={sendTestPush}
          disabled={!subscription || status === "working"}
        >
          发送测试通知
        </button>
      </div>
    </section>
  );
}

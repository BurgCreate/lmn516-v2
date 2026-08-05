"use client";

import { FormEvent, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export default function OwnerPushPage() {
  const [secret, setSecret] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function bindOwner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus("");

    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        throw new Error("当前浏览器不支持 Web Push。");
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("你没有允许通知权限。");
      }

      const keyResponse = await fetch("/api/push/public-key", { cache: "no-store" });
      const keyResult = await keyResponse.json();
      if (!keyResponse.ok || !keyResult?.publicKey) {
        throw new Error(keyResult?.error || "无法读取推送公钥。");
      }

      await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(keyResult.publicKey),
        });
      }

      const response = await fetch("/api/push/owner-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setupSecret: secret, subscription: subscription.toJSON() }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "绑定失败。");
      }

      setStatus("绑定成功：这台设备会接收新留言通知。");
      setSecret("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "绑定失败。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 560, margin: "80px auto", padding: "0 20px" }}>
      <h1>站长 PUSH 绑定</h1>
      <p>在需要接收新留言通知的设备上完成一次绑定。</p>
      <form onSubmit={bindOwner} style={{ display: "grid", gap: 14 }}>
        <input
          type="password"
          value={secret}
          onChange={(event) => setSecret(event.target.value)}
          placeholder="站长绑定密码"
          autoComplete="current-password"
          required
          style={{ padding: 12, fontSize: 16 }}
        />
        <button type="submit" disabled={busy} style={{ padding: 12, fontSize: 16 }}>
          {busy ? "绑定中…" : "绑定当前设备"}
        </button>
      </form>
      {status ? <p style={{ marginTop: 16 }}>{status}</p> : null}
    </main>
  );
}

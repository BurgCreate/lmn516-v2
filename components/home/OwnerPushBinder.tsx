"use client";

import { FormEvent, useEffect, useState } from "react";

function base64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
}

export function OwnerPushBinder() {
  const [open, setOpen] = useState(false);
  const [secret, setSecret] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, busy]);

  async function bindOwner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus("正在绑定…");

    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        throw new Error("请从 iPhone 主屏幕上的 LMN516 打开网站后再绑定。");
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("请允许 LMN516 发送通知。");
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        const keyResponse = await fetch("/api/push/public-key", { cache: "no-store" });
        const keyResult = await keyResponse.json();
        if (!keyResponse.ok || !keyResult.publicKey) {
          throw new Error(keyResult.error || "无法读取 VAPID 公钥。");
        }

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64ToUint8Array(keyResult.publicKey),
        });
      }

      const response = await fetch("/api/push/owner-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          setupSecret: secret,
          subscription: subscription.toJSON(),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "绑定失败。");
      }

      setStatus("站长设备绑定成功。以后有新留言会通知这台设备。");
      setSecret("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "绑定失败。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="footer-owner-trigger"
        onClick={() => {
          setStatus("");
          setOpen(true);
        }}
      >
        管理
      </button>

      {open ? (
        <div
          className="owner-push-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy) setOpen(false);
          }}
        >
          <section
            className="owner-push-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="owner-push-title"
          >
            <button
              type="button"
              className="owner-push-modal-close"
              aria-label="关闭"
              onClick={() => setOpen(false)}
              disabled={busy}
            >
              ×
            </button>

            <p className="eyebrow">OWNER PUSH</p>
            <h2 id="owner-push-title">绑定站长通知</h2>
            <p className="owner-push-modal-copy">
              输入站长密码，将当前设备登记为新留言通知接收设备。
            </p>

            <form className="owner-push-form" onSubmit={bindOwner}>
              <input
                type="password"
                value={secret}
                onChange={(event) => setSecret(event.target.value)}
                placeholder="站长绑定密码"
                autoComplete="current-password"
                required
                autoFocus
              />
              <button type="submit" disabled={busy || !secret.trim()}>
                {busy ? "正在绑定" : "绑定当前设备"}
              </button>
            </form>

            {status ? (
              <p className="owner-push-status" role="status">
                {status}
              </p>
            ) : null}
          </section>
        </div>
      ) : null}
    </>
  );
}

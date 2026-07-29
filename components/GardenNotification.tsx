"use client";

import { useEffect, useRef, useState } from "react";

type PermissionState = NotificationPermission | "unsupported";
type NoticeState = "idle" | "working" | "success" | "error";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

const DISMISS_KEY = "lmn516-garden-notice-dismissed-until-v3";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

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

function isAppleMobile() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export default function GardenNotification() {
  const [supported, setSupported] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const [permission, setPermission] =
    useState<PermissionState>("default");
  const [subscription, setSubscription] =
    useState<PushSubscription | null>(null);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [status, setStatus] = useState<NoticeState>("idle");
  const [message, setMessage] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    function handleAppInstalled() {
      setStandalone(true);
      setInstallPrompt(null);
      setStatus("success");
      setMessage("已经添加到主屏幕。请从桌面图标打开 LMN516，再开启通知。");
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    const appMode = isStandaloneMode();
    const browserSupported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    setStandalone(appMode);
    setSupported(browserSupported);

    const dismissedUntil = Number(
      window.localStorage.getItem(DISMISS_KEY) || "0"
    );

    if (appMode && Date.now() > dismissedUntil) {
      const welcomeTimer = window.setTimeout(() => {
        setWelcomeOpen(true);
      }, 500);

      if (!browserSupported) {
        setPermission("unsupported");
        return () => window.clearTimeout(welcomeTimer);
      }

      setPermission(Notification.permission);

      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => registration.pushManager.getSubscription())
        .then((existingSubscription) => {
          setSubscription(existingSubscription);

          if (
            existingSubscription ||
            Notification.permission !== "default"
          ) {
            setWelcomeOpen(false);
          }
        })
        .catch((error) => {
          console.error("Garden notification initialization failed:", error);
        });

      return () => window.clearTimeout(welcomeTimer);
    }

    if (!browserSupported) {
      setPermission("unsupported");
      return;
    }

    setPermission(Notification.permission);

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => registration.pushManager.getSubscription())
      .then((existingSubscription) => {
        setSubscription(existingSubscription);
      })
      .catch((error) => {
        console.error("Garden notification initialization failed:", error);
      });
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        panelOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setPanelOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [panelOpen]);

  async function saveSubscription(nextSubscription: PushSubscription) {
    const response = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription: nextSubscription.toJSON(),
      }),
    });

    const result = (await response.json()) as {
      ok?: boolean;
      error?: string;
    };

    if (!response.ok || !result.ok) {
      throw new Error(result.error || "保存推送订阅失败。");
    }
  }

  async function requestInstall() {
    setStatus("idle");

    if (standalone || isStandaloneMode()) {
      setStandalone(true);
      await enableNotifications();
      return;
    }

    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setInstallPrompt(null);

      if (choice.outcome === "accepted") {
        setStatus("success");
        setMessage("正在添加到主屏幕。安装完成后，请从桌面图标打开 LMN516，再点一次小铃铛开启通知。");
      } else {
        setStatus("idle");
        setMessage("没有关系，之后仍然可以从小铃铛再次添加。");
      }
      return;
    }

    if (isAppleMobile()) {
      setStatus("idle");
      setMessage("请点击 Safari 底部的分享按钮，再选择“添加到主屏幕”。安装后从桌面图标打开，才可以开启通知。");
      return;
    }

    setStatus("idle");
    setMessage("请打开浏览器菜单，选择“添加到主屏幕”或“安装应用”。安装后从桌面图标打开，再开启通知。");
  }

  async function enableNotifications() {
    if (!isStandaloneMode()) {
      await requestInstall();
      return;
    }

    setStandalone(true);

    if (!supported) {
      setStatus("error");
      setMessage(
        "这台设备已经成功打开 LMN516 App，但当前浏览器暂未提供 Web Push。你仍然可以正常浏览花园。"
      );
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!publicKey) {
      setStatus("error");
      setMessage("网站暂时没有读取到通知公钥。");
      setPanelOpen(true);
      return;
    }

    setStatus("working");
    setMessage("正在打开花园信使……");

    try {
      const nextPermission = await Notification.requestPermission();
      setPermission(nextPermission);

      if (nextPermission !== "granted") {
        setStatus("error");
        setMessage("通知没有开启。你可以稍后从小铃铛再次查看。");
        setWelcomeOpen(false);
        setPanelOpen(true);
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const currentSubscription =
        await registration.pushManager.getSubscription();
      const nextSubscription =
        currentSubscription ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }));

      await saveSubscription(nextSubscription);

      setSubscription(nextSubscription);
      setStatus("success");
      setMessage("花园信使已经开启。有新的故事时，我会轻轻告诉你。");
      setWelcomeOpen(false);
      setPanelOpen(true);
      window.localStorage.removeItem(DISMISS_KEY);
    } catch (error) {
      console.error("Enable garden notification failed:", error);
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "开启通知失败，请稍后再试。"
      );
      setPanelOpen(true);
    }
  }

  function dismissWelcome() {
    window.localStorage.setItem(
      DISMISS_KEY,
      String(Date.now() + SEVEN_DAYS)
    );
    setWelcomeOpen(false);
  }

  function togglePanel() {
    setPanelOpen((current) => !current);
    setStatus("idle");
    setMessage("");
  }

  const isSubscribed = permission === "granted" && Boolean(subscription);
  const needsInstall = !standalone;

  return (
    <div className="garden-notification" ref={panelRef}>
      <button
        type="button"
        className={`garden-bell${isSubscribed ? " is-active" : ""}`}
        onClick={togglePanel}
        aria-label={isSubscribed ? "花园通知已开启" : "开启花园通知"}
        aria-expanded={panelOpen}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
        </svg>
        {isSubscribed && <span className="garden-bell-dot" />}
      </button>

      {panelOpen && (
        <div className="garden-bell-panel" role="dialog" aria-label="花园信使">
          <p className="garden-notice-kicker">🌿 花园信使</p>

          {isSubscribed ? (
            <>
              <h2>已经保持联系</h2>
              <p>
                这里更新得很慢。只有当花园有新的变化时，我才会轻轻提醒你。
              </p>
            </>
          ) : permission === "denied" && standalone ? (
            <>
              <h2>通知暂时关闭</h2>
              <p>请在手机系统设置中允许 LMN516 发送通知。</p>
            </>
          ) : needsInstall ? (
            <>
              <h2>把花园带到主屏幕</h2>
              <p>
                先把 LMN516 添加到主屏幕，再从桌面图标打开，就可以接收新的照片、文章和碎碎念提醒。
              </p>
              <button
                type="button"
                className="garden-notice-primary"
                onClick={requestInstall}
              >
                📱 添加到主屏幕
              </button>
            </>
          ) : (
            <>
              <h2>听见花园的新消息</h2>
              <p>
                当这里有新的照片、文章或碎碎念时，我会轻轻告诉你，不会频繁打扰。
              </p>
              <button
                type="button"
                className="garden-notice-primary"
                onClick={enableNotifications}
                disabled={status === "working"}
              >
                {status === "working" ? "正在开启……" : "🌿 开启通知"}
              </button>
            </>
          )}

          {message && (
            <p className={`garden-notice-message is-${status}`}>{message}</p>
          )}
        </div>
      )}

      {welcomeOpen && (
        <div className="garden-welcome-backdrop" role="presentation">
          <section
            className="garden-welcome-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="garden-welcome-title"
          >
            <div className="garden-welcome-art" aria-hidden="true">
              <img src="/images/garden/garden-girl.jpeg" alt="" />
            </div>

            <div className="garden-welcome-copy">
              <p className="garden-notice-kicker">🌿 花园来信</p>
              <h2 id="garden-welcome-title">欢迎来到 LMN516</h2>
              <p>
                我会一直照顾这座小花园。如果这里有新的照片、故事或碎碎念，我会轻轻告诉你。
              </p>
              <p className="garden-welcome-note">
                这里更新得很慢，也不会频繁打扰你。
              </p>

              {message && (
                <p className={`garden-notice-message is-${status}`}>{message}</p>
              )}

              <div className="garden-welcome-actions">
                <button type="button" onClick={dismissWelcome}>
                  以后再说
                </button>
                <button
                  type="button"
                  className="garden-notice-primary"
                  onClick={enableNotifications}
                  disabled={status === "working"}
                >
                  {status === "working" ? "正在开启……" : "🌿 开启通知"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

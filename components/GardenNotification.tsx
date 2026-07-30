"use client";

import { useEffect, useRef, useState } from "react";

type PermissionState = NotificationPermission | "unsupported";
type NoticeState = "idle" | "working" | "success" | "error";
type PlatformType = "ios" | "android" | "desktop";
type BrowserType =
  | "safari"
  | "chrome"
  | "edge"
  | "samsung"
  | "huawei"
  | "quark"
  | "wechat"
  | "tiktok"
  | "instagram"
  | "other";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

type ClientEnvironment = {
  platform: PlatformType;
  browser: BrowserType;
  browserName: string;
  isInAppBrowser: boolean;
};

const DISMISS_KEY = "lmn516-garden-notice-dismissed-until-v4";
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

function detectEnvironment(): ClientEnvironment {
  const userAgent = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);

  if (/MicroMessenger/i.test(userAgent)) {
    return {
      platform: isIOS ? "ios" : isAndroid ? "android" : "desktop",
      browser: "wechat",
      browserName: "微信内置浏览器",
      isInAppBrowser: true,
    };
  }

  if (/musical_ly|TikTok/i.test(userAgent)) {
    return {
      platform: isIOS ? "ios" : isAndroid ? "android" : "desktop",
      browser: "tiktok",
      browserName: "TikTok 内置浏览器",
      isInAppBrowser: true,
    };
  }

  if (/Instagram/i.test(userAgent)) {
    return {
      platform: isIOS ? "ios" : isAndroid ? "android" : "desktop",
      browser: "instagram",
      browserName: "Instagram 内置浏览器",
      isInAppBrowser: true,
    };
  }

  let browser: BrowserType = "other";
  let browserName = "当前浏览器";

  if (/Quark/i.test(userAgent)) {
    browser = "quark";
    browserName = "夸克浏览器";
  } else if (/HuaweiBrowser/i.test(userAgent)) {
    browser = "huawei";
    browserName = "华为浏览器";
  } else if (/SamsungBrowser/i.test(userAgent)) {
    browser = "samsung";
    browserName = "三星浏览器";
  } else if (/EdgA|EdgiOS|Edg\//i.test(userAgent)) {
    browser = "edge";
    browserName = "Microsoft Edge";
  } else if (/CriOS|Chrome/i.test(userAgent)) {
    browser = "chrome";
    browserName = "Chrome";
  } else if (
    isIOS &&
    /Safari/i.test(userAgent) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(userAgent)
  ) {
    browser = "safari";
    browserName = "Safari";
  } else if (/Safari/i.test(userAgent) && !/Chrome|Chromium/i.test(userAgent)) {
    browser = "safari";
    browserName = "Safari";
  }

  return {
    platform: isIOS ? "ios" : isAndroid ? "android" : "desktop",
    browser,
    browserName,
    isInAppBrowser: false,
  };
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
  const [environment, setEnvironment] = useState<ClientEnvironment>({
    platform: "desktop",
    browser: "other",
    browserName: "当前浏览器",
    isInAppBrowser: false,
  });
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

    setEnvironment(detectEnvironment());
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

  async function copyCurrentUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus("success");
      setMessage("网址已经复制。请粘贴到 Safari 或 Chrome 中打开。");
    } catch {
      setStatus("error");
      setMessage("没有成功复制，请手动复制浏览器地址栏中的网址。");
    }
  }

  function showManualInstallGuide() {
    setStatus("idle");

    if (environment.isInAppBrowser) {
      setMessage(
        `请点击右上角菜单，选择“在浏览器中打开”。打开 Safari 或 Chrome 后，再点一次小铃铛。`
      );
      return;
    }

    if (environment.platform === "ios") {
      if (environment.browser === "safari") {
        setMessage(
          "只需两步：点击 Safari 底部的分享按钮，再点“添加到主屏幕”。添加后从桌面图标打开 LMN516。"
        );
      } else {
        setMessage(
          "为了获得通知，请先用 Safari 打开本页，再点击分享按钮 → 添加到主屏幕。"
        );
      }
      return;
    }

    if (environment.browser === "huawei") {
      setMessage(
        "请点击华为浏览器右下角或底部菜单，选择“添加至桌面”。添加后请从桌面图标重新打开，再点小铃铛。"
      );
      return;
    }

    if (environment.browser === "quark") {
      setMessage(
        "请打开夸克菜单，进入工具箱或更多功能，选择“添加到桌面”。如果桌面版仍不支持通知，建议改用 Chrome。"
      );
      return;
    }

    if (
      environment.browser === "chrome" ||
      environment.browser === "edge" ||
      environment.browser === "samsung"
    ) {
      setMessage(
        "请打开浏览器菜单，选择“安装应用”或“添加到主屏幕”。安装后从桌面图标打开，再点小铃铛。"
      );
      return;
    }

    setMessage(
      "请打开浏览器菜单，选择“添加到主屏幕”或“安装应用”。安装后从桌面图标打开，再开启通知。"
    );
  }

  async function requestInstall() {
    setStatus("idle");

    if (standalone || isStandaloneMode()) {
      setStandalone(true);
      await enableNotifications();
      return;
    }

    if (environment.isInAppBrowser) {
      showManualInstallGuide();
      return;
    }

    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setInstallPrompt(null);

      if (choice.outcome === "accepted") {
        setStatus("success");
        setMessage(
          "正在添加到主屏幕。完成后请从桌面图标打开 LMN516，再点一次小铃铛开启通知。"
        );
      } else {
        setStatus("idle");
        setMessage("没有关系，之后仍然可以从小铃铛再次添加。");
      }
      return;
    }

    showManualInstallGuide();
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
        `${environment.browserName} 已经从桌面打开 LMN516，但当前环境没有提供完整的 Web Push。建议使用 Chrome；iPhone 请使用添加到主屏幕后的 Safari Web App。`
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
  const shouldOfferCopy =
    needsInstall &&
    (environment.isInAppBrowser ||
      (environment.platform === "ios" && environment.browser !== "safari"));

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
              <h2>
                {environment.isInAppBrowser
                  ? "先在系统浏览器中打开"
                  : "把花园带到主屏幕"}
              </h2>
              <p>
                当前环境：{environment.browserName}。{installPrompt
                  ? "点击下面的按钮即可调出系统安装窗口。"
                  : environment.platform === "ios"
                    ? "完成添加后，从桌面图标打开，才能开启通知。"
                    : "添加后从桌面图标重新打开，再开启通知。"}
              </p>
              <button
                type="button"
                className="garden-notice-primary"
                onClick={requestInstall}
              >
                {installPrompt
                  ? "📱 立即安装 LMN516"
                  : environment.isInAppBrowser
                    ? "🌐 查看打开方法"
                    : "📱 查看添加方法"}
              </button>
              {shouldOfferCopy && (
                <button type="button" onClick={copyCurrentUrl}>
                  复制网址
                </button>
              )}
            </>
          ) : (
            <>
              <h2>听见花园的新消息</h2>
              <p>
                当前环境：{environment.browserName}。点击一次即可请求系统通知权限。
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
              <img src="/garden-assets/characters/garden-girl-welcome.jpeg" alt="" />
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

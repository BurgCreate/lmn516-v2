"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandaloneMode() {
  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

export default function InstallPrompt() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setMounted(true);
    setInstalled(isStandaloneMode());

    const userAgent = window.navigator.userAgent;
    const ios = /iPhone|iPad|iPod/i.test(userAgent);
    const safari =
      /Safari/i.test(userAgent) &&
      !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/i.test(userAgent);

    setIsIOS(ios);
    setIsSafari(safari);

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    function handleInstalled() {
      setInstalled(true);
      setOpen(false);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function handlePrimaryAction() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;

      if (choice.outcome === "accepted") {
        setOpen(false);
      }

      setDeferredPrompt(null);
      return;
    }

    setOpen(true);
  }

  if (!mounted || installed) {
    return null;
  }

  const showIOSSteps = isIOS && isSafari;

  return (
    <div className="install-prompt">
      <button
        type="button"
        className="install-prompt-trigger"
        onClick={handlePrimaryAction}
        aria-label="添加 LMN516 到主屏幕"
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3v12M7 8l5-5 5 5M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
        </svg>
      </button>

      {open && (
        <div
          className="install-prompt-backdrop"
          role="presentation"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <section
            className="install-prompt-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-prompt-title"
          >
            <button
              type="button"
              className="install-prompt-close"
              onClick={() => setOpen(false)}
              aria-label="关闭"
            >
              ×
            </button>

            <p className="install-prompt-kicker">🌱 LMN516</p>
            <h2 id="install-prompt-title">放进主屏幕</h2>
            <p className="install-prompt-copy">
              以后打开，就像翻开一本数字花园。
            </p>

            {showIOSSteps ? (
              <ol className="install-prompt-steps">
                <li>
                  <span>1</span>
                  点击 Safari 下方的分享按钮
                </li>
                <li>
                  <span>2</span>
                  选择「添加到主屏幕」
                </li>
              </ol>
            ) : (
              <p className="install-prompt-note">
                请使用 Safari 打开，再添加到主屏幕。
              </p>
            )}

            <button
              type="button"
              className="install-prompt-done"
              onClick={() => setOpen(false)}
            >
              我知道了
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  sender: "visitor" | "owner";
  content: string;
  createdAt: string;
};

type MessagePanelProps = {
  open: boolean;
  onClose: () => void;
};

const VISITOR_KEY = "lmn516-message-visitor";
const CONVERSATION_KEY = "lmn516-message-conversation";

function createVisitorToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}


async function getCurrentPushSubscription() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return null;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription ? subscription.toJSON() : null;
  } catch (error) {
    console.error("Reading push subscription failed:", error);
    return null;
  }
}

function getVisitorToken() {
  const saved = window.localStorage.getItem(VISITOR_KEY);
  if (saved) return saved;

  const token = createVisitorToken();
  window.localStorage.setItem(VISITOR_KEY, token);
  return token;
}

export default function MessagePanel({ open, onClose }: MessagePanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "sending" | "success" | "error">("idle");
  const [notice, setNotice] = useState("");
  const pollingRef = useRef(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const shouldFollowRef = useRef(true);
  const [pendingMessages, setPendingMessages] = useState(0);

  const scrollToLatest = useCallback((behavior: ScrollBehavior = "smooth") => {
    const thread = threadRef.current;
    if (!thread) return;
    thread.scrollTo({ top: thread.scrollHeight, behavior });
    shouldFollowRef.current = true;
    setPendingMessages(0);
  }, []);

  const updateFollowState = useCallback(() => {
    const thread = threadRef.current;
    if (!thread) return;
    shouldFollowRef.current = thread.scrollHeight - thread.scrollTop - thread.clientHeight < 80;
    if (shouldFollowRef.current) setPendingMessages(0);
  }, []);

  const refreshMessages = useCallback(async (showLoading = false) => {
    const conversationId = window.localStorage.getItem(CONVERSATION_KEY);
    if (!conversationId || pollingRef.current || document.hidden) return;

    pollingRef.current = true;
    if (showLoading) setStatus("loading");

    try {
      const response = await fetch(
        `/api/messages/${encodeURIComponent(conversationId)}?visitorToken=${encodeURIComponent(getVisitorToken())}`,
        { cache: "no-store" }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "暂时无法读取之前的留言。");

      const nextMessages = (result.messages || []) as Message[];
      setMessages((current) => {
        const currentLastId = current.at(-1)?.id;
        const nextLastId = nextMessages.at(-1)?.id;
        if (current.length === nextMessages.length && currentLastId === nextLastId) return current;

        const added = Math.max(0, nextMessages.length - current.length);
        if (added > 0) {
          if (shouldFollowRef.current) {
            window.requestAnimationFrame(() => scrollToLatest("smooth"));
          } else {
            setPendingMessages((count) => count + added);
          }
        }
        return nextMessages;
      });
      if (showLoading) setStatus("idle");
    } catch (error) {
      console.error(error);
      if (showLoading) {
        setStatus("error");
        setNotice(error instanceof Error ? error.message : "暂时无法读取之前的留言。");
      }
    } finally {
      pollingRef.current = false;
    }
  }, [scrollToLatest]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const handleVisibilityChange = () => {
      if (!document.hidden) void refreshMessages(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    void refreshMessages(true).then(() => window.requestAnimationFrame(() => scrollToLatest("auto")));
    const timer = window.setInterval(() => void refreshMessages(false), 2000);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearInterval(timer);
    };
  }, [open, onClose, refreshMessages, scrollToLatest]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = content.trim();

    if (!message || status === "sending") return;
    if (message.length > 1000) {
      setStatus("error");
      setNotice("一封信最多 1000 个字。再长一点，就快变成连载小说了。");
      return;
    }

    setStatus("sending");
    setNotice("");

    try {
      const visitorToken = getVisitorToken();
      const conversationId = window.localStorage.getItem(CONVERSATION_KEY);
      const pushSubscription = await getCurrentPushSubscription();
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorToken, conversationId, content: message, pushSubscription }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "留言没有送达，请稍后再试。");
      }

      window.localStorage.setItem(CONVERSATION_KEY, result.conversationId);
      setMessages(result.messages || []);
      window.requestAnimationFrame(() => scrollToLatest("smooth"));
      setContent("");
      setStatus("success");
      setNotice("已经送到啦。我看到后会从这里回复你。🫧");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setNotice(error instanceof Error ? error.message : "留言没有送达，请稍后再试。");
    }
  }

  if (!open) return null;

  return (
    <div className="message-panel-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        ref={panelRef}
        className="message-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-panel-title"
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="message-panel-header">
          <div>
            <p className="message-panel-kicker">🫧 花园信箱</p>
            <h2 id="message-panel-title">和我说点什么</h2>
            <p>不用注册，也不用留下邮箱。你的回复会保存在这台设备里。</p>
          </div>
          <button type="button" className="message-panel-close" onClick={onClose} aria-label="关闭留言窗口">×</button>
        </header>

        {messages.length > 0 && (
          <div ref={threadRef} className="message-thread" aria-label="留言记录" onScroll={updateFollowState}>
            {messages.map((message) => (
              <article className={`message-item is-${message.sender}`} key={message.id}>
                <p>{message.content}</p>
                <time>{message.createdAt}</time>
              </article>
            ))}
            {pendingMessages > 0 && (
              <button type="button" className="message-new-button" onClick={() => scrollToLatest("smooth")}>
                ↓ {pendingMessages > 1 ? `${pendingMessages} 条新消息` : "新消息"}
              </button>
            )}
          </div>
        )}

        <form className="message-form" onSubmit={handleSubmit}>
          <label htmlFor="garden-message">写一封小信</label>
          <textarea
            id="garden-message"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="可以是问候、建议，也可以只是路过时留下的一句话……"
            maxLength={1000}
            rows={5}
            disabled={status === "sending"}
          />
          <div className="message-form-footer">
            <span>{content.length}/1000</span>
            <button type="submit" disabled={!content.trim() || status === "sending"}>
              {status === "sending" ? "正在送出……" : "送出留言"}
            </button>
          </div>
        </form>

        {notice && <p className={`message-panel-notice is-${status}`} role="status">{notice}</p>}

        <footer className="message-panel-footer">
          <Link href="/moments" onClick={onClose}>看看最近的碎碎念</Link>
          <span>你的匿名编号只保存在当前浏览器中</span>
        </footer>
      </section>
    </div>
  );
}

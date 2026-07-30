"use client";

import { useCallback, useState } from "react";
import MessagePanel from "@/components/MessagePanel";

type MomentBubbleProps = {
  content: string;
  date: string;
};

export default function MomentBubble({ content, date }: MomentBubbleProps) {
  const [isMoving, setIsMoving] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const closePanel = useCallback(() => setPanelOpen(false), []);

  function handleClick() {
    setIsMoving(false);
    requestAnimationFrame(() => setIsMoving(true));
    window.setTimeout(() => setIsMoving(false), 500);
    setPanelOpen(true);
  }

  return (
    <>
      <button
        type="button"
        className={`moment-bubble ${isMoving ? "moment-bubble-active" : ""}`}
        onClick={handleClick}
        aria-label="打开花园信箱"
        aria-expanded={panelOpen}
      >
        <span className="moment-bubble-ring" aria-hidden="true" />
        <span className="moment-bubble-content" dangerouslySetInnerHTML={{ __html: content }} />
        <small className="moment-bubble-time">{date}</small>
        <span className="moment-bubble-message-hint" aria-hidden="true">点我留言</span>
      </button>

      <MessagePanel open={panelOpen} onClose={closePanel} />
    </>
  );
}

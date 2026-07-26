"use client";

import { useState } from "react";

type MomentBubbleProps = {
  content: string;
  date: string;
};

export default function MomentBubble({
  content,
  date,
}: MomentBubbleProps) {
  const [isMoving, setIsMoving] = useState(false);

  function handleClick() {
    setIsMoving(false);

    requestAnimationFrame(() => {
      setIsMoving(true);
    });

    window.setTimeout(() => {
      setIsMoving(false);
    }, 700);
  }

  return (
    <button
      type="button"
      className={`moment-bubble ${
        isMoving ? "moment-bubble-active" : ""
      }`}
      onClick={handleClick}
      aria-label="点击气泡，让它动一下"
    >
      <span
        className="moment-bubble-content"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />

      <small className="moment-bubble-time">
        {date}
      </small>
    </button>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type MomentBubbleProps = {
  content: string;
  date: string;
};

export default function MomentBubble({
  content,
  date,
}: MomentBubbleProps) {
  const router = useRouter();
  const [isMoving, setIsMoving] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  function handleClick() {
    if (isNavigating) return;

    setIsMoving(false);
    setIsNavigating(true);

    requestAnimationFrame(() => {
      setIsMoving(true);
    });

    window.setTimeout(() => {
      router.push("/moments");
    }, 300);
  }

  return (
    <button
      type="button"
      className={`moment-bubble ${
        isMoving ? "moment-bubble-active" : ""
      }`}
      onClick={handleClick}
      aria-label="进入碎碎念页面"
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
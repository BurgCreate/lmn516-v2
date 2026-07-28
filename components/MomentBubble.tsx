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
  const [isLeaving, setIsLeaving] = useState(false);

  function handleClick() {
    if (isLeaving) return;

    setIsMoving(false);
    setIsLeaving(true);

    requestAnimationFrame(() => {
      setIsMoving(true);
    });

    document.documentElement.classList.add(
      "page-leaving"
    );

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.setTimeout(() => {
      router.push("/moments");
    }, prefersReducedMotion ? 0 : 420);
  }

  return (
    <button
      type="button"
      className={`moment-bubble ${
        isMoving ? "moment-bubble-active" : ""
      } ${
        isLeaving
          ? "moment-bubble-leaving"
          : ""
      }`}
      onClick={handleClick}
      aria-label="进入碎碎念页面"
      disabled={isLeaving}
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
"use client";

import { useEffect, useState } from "react";

function getClock() {
  const now = new Date();
  return {
    time: new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Shanghai",
    }).format(now),
    date: new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long",
      timeZone: "Asia/Shanghai",
    }).format(now),
  };
}

export default function HomeClock() {
  const [clock, setClock] = useState(getClock);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(getClock()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="v3-clock">
      <div className="v3-clock-face" aria-hidden="true">
        <span className="v3-clock-hand v3-clock-hour" />
        <span className="v3-clock-hand v3-clock-minute" />
        <span className="v3-clock-dot" />
      </div>
      <div>
        <span className="v3-small-label">现在时间</span>
        <strong>{clock.time}</strong>
        <small>{clock.date.replaceAll("/", " / ")}</small>
      </div>
    </div>
  );
}

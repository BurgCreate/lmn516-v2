"use client";

import { useEffect, useState } from "react";

function getBeijingTime() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Shanghai" }));
}

export default function HomeClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(getBeijingTime());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!now) return <div className="v3-clock-loading">--:--</div>;

  const time = now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
  const date = `${now.getFullYear()} / ${String(now.getMonth() + 1).padStart(2, "0")} / ${String(now.getDate()).padStart(2, "0")}`;
  const weekday = now.toLocaleDateString("zh-CN", { weekday: "long" });

  return (
    <div className="v3-clock">
      <div className="v3-clock-top"><span className="v3-clock-icon" aria-hidden="true">◷</span><span>现在时间</span></div>
      <strong>{time}</strong>
      <small>{date}　{weekday}</small>
    </div>
  );
}

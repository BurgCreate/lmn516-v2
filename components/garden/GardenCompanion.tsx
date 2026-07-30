"use client";

import { useEffect, useMemo, useState } from "react";

const DAILY_NOTES = [
  "今天也不用赶路。先在这里坐一会儿吧。",
  "花园刚刚醒来，叶子上还留着一点晨光。",
  "欢迎回来。你不在的时候，花也有认真长大。",
  "今天适合读几页书，也适合什么都不做。",
  "风从小路那边吹过来，带来了一点新的故事。",
  "慢一点没有关系，生长本来就不是一件着急的事。",
  "这里替你留着一个位置，累了就回来歇一会儿。",
];

const DAY_LABELS = [
  "星期日的花园",
  "星期一的花园",
  "星期二的花园",
  "星期三的花园",
  "星期四的花园",
  "星期五的花园",
  "星期六的花园",
];

function formatGardenDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
  }).format(date);
}

export default function GardenCompanion() {
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  const companion = useMemo(() => {
    if (!today) {
      return {
        label: "今天的花园",
        note: "花园正在醒来，请稍等一小会儿。",
        date: "慢慢生长中",
      };
    }

    const day = today.getDay();

    return {
      label: DAY_LABELS[day],
      note: DAILY_NOTES[day],
      date: formatGardenDate(today),
    };
  }, [today]);

  return (
    <aside className="garden-companion" aria-label="花园主人今日便签">
      <span className="garden-companion-tape" aria-hidden="true" />

      <div className="garden-companion-heading">
        <span className="garden-companion-flower" aria-hidden="true">✿</span>
        <div>
          <p>花园主人留下的便签</p>
          <span>{companion.label}</span>
        </div>
      </div>

      <p className="garden-companion-note">“{companion.note}”</p>

      <div className="garden-companion-footer">
        <span>Garden Girl</span>
        <time>{companion.date}</time>
      </div>
    </aside>
  );
}

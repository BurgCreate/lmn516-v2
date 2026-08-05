"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type TodayArchiveProps = {
  featuredTitle: string;
  featuredSlug?: string;
};

type ShanghaiTime = {
  year: number;
  month: string;
  day: string;
  weekday: string;
  hour: string;
  minute: string;
};

function getShanghaiTime(date: Date): ShanghaiTime {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    year: Number(get("year")),
    month: get("month"),
    day: get("day"),
    weekday: get("weekday"),
    hour: get("hour"),
    minute: get("minute"),
  };
}

function getIsoWeek(year: number, month: string, day: string) {
  const date = new Date(Date.UTC(year, Number(month) - 1, Number(day)));
  const weekday = date.getUTCDay() || 7;

  date.setUTCDate(date.getUTCDate() + 4 - weekday);

  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export default function TodayArchive({
  featuredTitle,
  featuredSlug,
}: TodayArchiveProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const update = () => setNow(new Date());
    const delay = 60000 - (Date.now() % 60000);
    let interval: ReturnType<typeof setInterval> | undefined;

    const timeout = setTimeout(() => {
      update();
      interval = setInterval(update, 60000);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  const time = useMemo(() => getShanghaiTime(now), [now]);
  const week = useMemo(
    () => getIsoWeek(time.year, time.month, time.day),
    [time.year, time.month, time.day]
  );

  const yearProgress = useMemo(() => {
    const current = Date.UTC(time.year, Number(time.month) - 1, Number(time.day) + 1);
    const start = Date.UTC(time.year, 0, 1);
    const end = Date.UTC(time.year + 1, 0, 1);

    return (((current - start) / (end - start)) * 100).toFixed(1);
  }, [time.year, time.month, time.day]);

  return (
    <div className="today-summary">
      <p className="card-label">今日档案</p>

      <div className="today-date-row">
        <div className="date-block">
          <strong>{time.month}.{time.day}</strong>
          <span>{time.weekday} · 盛夏</span>
        </div>

        <div className="time-block" aria-label={`北京时间 ${time.hour}:${time.minute}`}>
          <strong>{time.hour}:{time.minute}</strong>
          <span>北京时间</span>
        </div>
      </div>

      <dl className="today-meta">
        <div>
          <dt>时间坐标</dt>
          <dd>{time.year} · 第{week}周</dd>
        </div>

        <div>
          <dt>年度进度</dt>
          <dd>{yearProgress}%</dd>
        </div>

        <div>
          <dt>本期封面</dt>
          <dd title={featuredTitle}>
            {featuredSlug ? (
              <Link className="today-featured-link" href={`/posts/${featuredSlug}`}>
                <span>{featuredTitle}</span>
                <span className="today-featured-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ) : (
              featuredTitle
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}

import type { GardenMoment } from "./types";

export const randomItem = <T,>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)];

export function getShanghaiMoment(date = new Date()): GardenMoment {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value || "";

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const year = Number(value("year"));
  const month = value("month");
  const day = value("day");

  return {
    year,
    fullDate: `${year}-${month}-${day}`,
    monthDay: `${month}-${day}`,
    weekday: weekdayMap[value("weekday")] ?? 0,
    hour: Number(value("hour")),
  };
}

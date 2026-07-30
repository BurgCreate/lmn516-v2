import { getDaypartTitles } from "./dayparts";
import { ordinaryTitles, rareTitles } from "./easterEggs";
import { datedFestivals, fixedFestivals } from "./holidays";
import { solarTermsByMonthDay } from "./solarTerms";
import { getShanghaiMoment, randomItem } from "./utils";
import { weekdayTitles } from "./weekdays";

export function getGardenMessengerTitle(date = new Date()): string {
  const moment = getShanghaiMoment(date);

  const exactFestival = datedFestivals[moment.fullDate];
  if (exactFestival) return randomItem(exactFestival);

  const fixedFestival = fixedFestivals[moment.monthDay];
  if (fixedFestival) return randomItem(fixedFestival);

  const solarTerm = solarTermsByMonthDay[moment.monthDay];
  if (solarTerm) return randomItem(solarTerm);

  if (Math.random() < 0.01) return randomItem(rareTitles);

  if (moment.weekday === 0 || moment.weekday === 6) {
    return randomItem(weekdayTitles[moment.weekday]);
  }

  if (Math.random() < 0.35) {
    return randomItem(weekdayTitles[moment.weekday]);
  }

  if (Math.random() < 0.7) {
    return randomItem(getDaypartTitles(moment.hour));
  }

  return randomItem(ordinaryTitles);
}

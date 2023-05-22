import {
  addDays,
  differenceInCalendarDays,
  endOfDay,
  endOfWeek,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
  startOfWeek
} from "date-fns";

import icsProxyHandler from "./icsProxy";

const onlyDates = (v) => v.type === "VEVENT";

const rangeOverlaps = (start1, end1, start2, end2) => (isBefore(start1, end2) || isSameDay(start1, end2))
  && (isBefore(start2, end1) || isSameDay(start2, end1));

const betweenDates = (event, startRange, endRange) => {
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  if (typeof event.rrule === "undefined") {
    return rangeOverlaps(startDate, endDate, startRange, endRange);
  }

  // todo: Recurring logic …fear…

  return false;
};

const dateSort = (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime();

const widget = {
  api: "{url}",
  proxyHandler: icsProxyHandler,

  mappings: {
    "agenda": {
      endpoint: "/",
      map: (data) => Object.values(data).filter(onlyDates)
        .filter(d => isAfter(new Date(d.end), new Date()))
        .sort(dateSort)
    },
    "day": {
      endpoint: "/",
      map: (data) => Object.values(data).filter(onlyDates)
        .filter(d => betweenDates(d, startOfDay(new Date), endOfDay(new Date)))
        .sort(dateSort)
    },
    "week": {
      endpoint: "/",
      map: (data) => Object.values(data).filter(onlyDates)
        .filter(d => betweenDates(d, startOfWeek(new Date), endOfWeek(new Date)))
        .sort(dateSort)
        .reduce((acc, cur) => {
          const s = startOfDay(cur.start);
          const diff = differenceInCalendarDays(s, startOfWeek(new Date()));
          acc[diff].push(cur);
          return acc;
        }, [[], [], [], [], [], [], []])
    }
  }
};

export default widget;

import { StartEndDates } from './types';

/**
 * Get start and end dates of current week in ISO 8601.
 *
 * @returns {StartEndDates}
 */
export const getStartEndDates = (): StartEndDates => {
  let currentDate = new Date();

  // first day of the week = current day of the month - current day of the week
  const firstDay = currentDate.getDate() - currentDate.getDay();
  let start = new Date(currentDate);
  start.setDate(firstDay);
  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  start.setMilliseconds(0);

  const lastDay = firstDay + 6;
  let end = new Date(currentDate);
  end.setDate(lastDay);
  end.setHours(23);
  end.setMinutes(59);
  end.setSeconds(59);
  end.setMilliseconds(999);

  return {
    start: {
      date: start,
      iso: getIsoLocalTimezone(start),
    },
    end: {
      date: end,
      iso: getIsoLocalTimezone(end),
    },
  };
};

/**
 * Get start and end dates of today in ISO 8601.
 *
 * @returns {StartEndDates}
 */
export const getTodayAsStartEndDates = (): StartEndDates => {
  let currentDate = new Date();

  let start = new Date(currentDate);
  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  start.setMilliseconds(0);

  let end = new Date(currentDate);
  end.setHours(23);
  end.setMinutes(59);
  end.setSeconds(59);
  end.setMilliseconds(999);

  return {
    start: {
      date: start,
      iso: getIsoLocalTimezone(start),
    },
    end: {
      date: end,
      iso: getIsoLocalTimezone(end),
    },
  };
};

/**
 * Get a timezone offset for a specific date in the format of '-0700'.
 *
 * @returns {string}
 */
export const getTimezone = (date: Date): string => {
  const tzoff = date.getTimezoneOffset();
  const h = Math.floor(Math.abs(tzoff) / 60);
  const m = tzoff % 60;
  return (tzoff < 0 ? '+' : '-') + h.toString().padStart(2, '0') + m.toString().padStart(2, '0');
}

/**
 * Get a timezone offset for the local time in the format of '-0700'.
 *
 * @returns {string}
 */
export const getLocalTimezone = (): string => {
  return getTimezone(new Date());
}

/**
 * Get a date in ISO 8601 in the local timezone.
 *
 * format: 2023-04-16T00:00:00.000-0700, 2023-04-22T23:59:59.999-0700
 *
 * @returns {string}
 */
export const getIsoLocalTimezone = (date: Date): string => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, -1) + getTimezone(date);
}

/**
 * Get today's date in ISO 8601.
 *
 * @returns {string}
 */
export const getTodaysDate = (): string => {
  const date = new Date();
  return (
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    date.getDate().toString().padStart(2, '0')
  );
};

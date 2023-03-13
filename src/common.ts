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
  const lastDay = firstDay + 6;

  let start = new Date(currentDate);
  let end = new Date(currentDate);
  start.setDate(firstDay);
  end.setDate(lastDay);

  return {
    start: {
      date: start,
      iso: start.toISOString(),
    },
    end: {
      date: end,
      iso: end.toISOString(),
    },
  };
};

/**
 * Get today's date in ISO 8601.
 *
 * @returns {string}
 */
export const getTodayUTCDate = (): string => {
  const date = new Date();
  return (
    date.getUTCFullYear() +
    '-' +
    (date.getUTCMonth() + 1).toString().padStart(2, '0') +
    '-' +
    date.getUTCDate().toString().padStart(2, '0')
  );
};

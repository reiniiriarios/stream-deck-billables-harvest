import { getStartEndDates, getTodayAsStartEndDates } from './common';
import { displayError, displayTimerTotal } from './display';
import { getLoggedHours } from './status';
import { Settings, StartEndDates, TimePeriod } from './types';

/**
 * Update timer.
 *
 * Callback for Stream Deck action updates.
 *
 * @param {string} context
 * @param {Settings} settings
 */
export const updateTimerTotal = async (context: string, settings: Settings) => {
  try {
    if (!settings.harvestAccountId?.length || !settings.harvestAccountToken?.length) {
      throw new Error('EAUTH: Missing keys, unable to display timer total.');
    }
    let startEnd: StartEndDates;
    switch (settings.timePeriod) {
      case TimePeriod.Day:
        startEnd = getTodayAsStartEndDates();
        break;
      case TimePeriod.Week:
      default:
        startEnd = getStartEndDates();
        break;
    }
    const loggedHours = getLoggedHours(settings, startEnd, settings.billable);
    displayTimerTotal(context, await loggedHours, settings.timeFormat);
  } catch (e) {
    displayError(context, e);
  }
};

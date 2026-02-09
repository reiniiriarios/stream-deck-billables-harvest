/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

import { updateStatus } from './status';
import config from '../config.js';
import { changeTimer, updateTimer } from './timer';
import { updateTimerTotal } from './timer-total';
import { ButtonAction, Settings } from './types';
import { getFetchIntervalMilliseconds, withDefaultSettings } from './settings';

const actionStatus = new Action(config.appName + '.status');
const actionTimer = new Action(config.appName + '.timer');
const actionTimerTotal = new Action(config.appName + '.timer-total');

const settingsByContext: Map<string, Settings> = new Map();
const updateIntervalByContext: Map<string, ReturnType<typeof setInterval>> = new Map();

/**
 * The first event fired when Stream Deck starts
 */
$SD.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }): void => {
  console.log('Stream Deck connected!');
});

const clearContextInterval = (context: string): void => {
  const existingInterval = updateIntervalByContext.get(context);
  if (existingInterval) {
    clearInterval(existingInterval);
    updateIntervalByContext.delete(context);
  }
};

const setContextSettings = (context: string, settings: Partial<Settings>): Settings => {
  const normalizedSettings = withDefaultSettings(settings);
  settingsByContext.set(context, normalizedSettings);
  return normalizedSettings;
};

const getContextSettings = (context: string): Settings => {
  if (settingsByContext.has(context)) {
    return settingsByContext.get(context);
  }
  return setContextSettings(context, {});
};

const startContextUpdates = (
  context: string,
  settings: Partial<Settings>,
  updateFn: (context: string, settings: Settings) => Promise<void> | void
): void => {
  const normalizedSettings = setContextSettings(context, settings);
  clearContextInterval(context);
  updateFn(context, normalizedSettings);
  const interval = setInterval(() => {
    const latestSettings = getContextSettings(context);
    updateFn(context, latestSettings);
  }, getFetchIntervalMilliseconds(normalizedSettings));
  updateIntervalByContext.set(context, interval);
};

const stopContextUpdates = (context: string): void => {
  clearContextInterval(context);
  settingsByContext.delete(context);
};

actionStatus.onWillAppear(({ action, context, device, event, payload }): void => {
  startContextUpdates(context, payload.settings, updateStatus);
});

actionStatus.onDidReceiveSettings(({ action, context, device, event, payload }): void => {
  startContextUpdates(context, payload.settings, updateStatus);
});

actionStatus.onWillDisappear(({ action, context, device, event, payload }): void => {
  stopContextUpdates(context);
});

actionStatus.onKeyUp(({ action, context, device, event, payload }): void => {
  const settings = getContextSettings(context);
  switch (settings.buttonAction ?? null) {
    case ButtonAction.OpenHarvest:
      $SD.openUrl('https://harvestapp.com/time');
      break;
    case ButtonAction.OpenForecast:
      if (settings.forecastAccountId?.length) {
        $SD.openUrl('https://app.forecast.it/' + settings.forecastAccountId + '/schedule/team');
      }
      else {
        $SD.openUrl('https://app.forecast.it/');
      }
      break;
    case ButtonAction.Update:
    default:
      updateStatus(context, settings);
  }
});

actionTimer.onWillAppear(({ action, context, device, event, payload }): void => {
  startContextUpdates(context, payload.settings, updateTimer);
});

actionTimer.onDidReceiveSettings(({ action, context, device, event, payload }): void => {
  startContextUpdates(context, payload.settings, updateTimer);
});

actionTimer.onWillDisappear(({ action, context, device, event, payload }): void => {
  stopContextUpdates(context);
});

actionTimer.onKeyUp(({ action, context, device, event, payload }): void => {
  changeTimer(context, getContextSettings(context));
});

actionTimerTotal.onWillAppear(({ action, context, device, event, payload }): void => {
  startContextUpdates(context, payload.settings, updateTimerTotal);
});

actionTimerTotal.onDidReceiveSettings(({ action, context, device, event, payload }): void => {
  startContextUpdates(context, payload.settings, updateTimerTotal);
});

actionTimerTotal.onWillDisappear(({ action, context, device, event, payload }): void => {
  stopContextUpdates(context);
});

actionTimerTotal.onKeyUp(({ action, context, device, event, payload }): void => {
  updateTimerTotal(context, getContextSettings(context));
});

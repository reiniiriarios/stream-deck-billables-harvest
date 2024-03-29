/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

import { updateStatus } from './status';
import config from '../config.js';
import { changeTimer, updateTimer } from './timer';
import { updateTimerTotal } from './timer-total';

const actionStatus = new Action(config.appName + '.status');
const actionTimer = new Action(config.appName + '.timer');
const actionTimerTotal = new Action(config.appName + '.timer-total');

/**
 * The first event fired when Stream Deck starts
 */
$SD.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }): void => {
  console.log('Stream Deck connected!');
});

actionStatus.onWillAppear(({ action, context, device, event, payload }): void => {
  const intervalMinutes = parseInt(payload.settings.fetchInterval);
  const interval = (intervalMinutes < 1 ? 1 : intervalMinutes) * 60000;
  updateStatus(context, payload.settings);
  setInterval(() => {
    updateStatus(context, payload.settings);
  }, interval);
});

actionStatus.onKeyUp(({ action, context, device, event, payload }): void => {
  switch (payload.settings.buttonAction ?? null) {
    case 'openHarvest':
      $SD.openUrl('https://harvestapp.com/time');
      break;
    case 'openForecast':
      if (payload.settings.forecastAccountId?.length) {
        $SD.openUrl('https://forecastapp.com/' + payload.settings.forecastAccountId + '/schedule/team');
      }
      else {
        $SD.openUrl('https://forecastapp.com/');
      }
      break;
    case 'update':
    default:
      updateStatus(context, payload.settings);
  }
});

actionTimer.onWillAppear(({ action, context, device, event, payload }): void => {
  const intervalMinutes = parseInt(payload.settings.fetchInterval);
  const interval = (intervalMinutes < 1 ? 1 : intervalMinutes) * 60000;
  updateTimer(context, payload.settings);
  setInterval(() => {
    updateTimer(context, payload.settings);
  }, interval);
});

actionTimer.onKeyUp(({ action, context, device, event, payload }): void => {
  changeTimer(context, payload.settings);
});

actionTimerTotal.onWillAppear(({ action, context, device, event, payload }): void => {
  const intervalMinutes = parseInt(payload.settings.fetchInterval);
  const interval = (intervalMinutes < 1 ? 1 : intervalMinutes) * 60000;
  updateTimerTotal(context, payload.settings);
  setInterval(() => {
    updateTimerTotal(context, payload.settings);
  }, interval);
});

actionTimerTotal.onKeyUp(({ action, context, device, event, payload }): void => {
  updateTimerTotal(context, payload.settings);
});

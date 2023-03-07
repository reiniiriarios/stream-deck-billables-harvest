/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

import { updateStatus } from './status';
import config from '../config.js';
import { changeTimer, updateTimer } from './timer';

const actionStatus = new Action(config.appName + '.status');
const actionTimer = new Action(config.appName + '.timer');

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
  updateStatus(context, payload.settings);
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

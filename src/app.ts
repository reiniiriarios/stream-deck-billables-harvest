/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

import { updateStatus } from './status-update';
import config from '../config.js';

const actionUpdateStatus = new Action(config.appName + '.status');

/**
 * The first event fired when Stream Deck starts
 */
$SD.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }): void => {
  console.log('Stream Deck connected!');
});

actionUpdateStatus.onWillAppear(({ action, context, device, event, payload }): void => {
  const intervalMinutes = parseInt(payload.settings.fetchInterval);
  const interval = (intervalMinutes < 1 ? 1 : intervalMinutes) * 60000;
  updateStatus(context, payload.settings);
  setInterval(() => {
    updateStatus(context, payload.settings);
  }, interval);
});

actionUpdateStatus.onKeyUp(({ action, context, device, event, payload }): void => {
  updateStatus(context, payload.settings);
});

/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />
/// <reference path="status-update.js" />

const actionUpdateStatus = new Action('me.reinii.harvest-billables.status');

/**
 * The first event fired when Stream Deck starts
 */
$SD.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }) => {
  console.log('Stream Deck connected!');
});

actionUpdateStatus.onWillAppear(({ action, context, device, event, payload }) => {
  const intervalMinutes = parseInt(payload.settings.fetchInterval);
  const interval = (intervalMinutes < 1 ? 1 : intervalMinutes) * 60000;
  updateStatus(context, payload.settings);
  setInterval(() => {
    updateStatus(context, payload.settings);
  }, interval);
});

actionUpdateStatus.onKeyUp(({ action, context, device, event, payload }) => {
  updateStatus(context, payload.settings);
});

/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />
/// <reference path="update-status.js" />

const actionUpdateStatus = new Action('me.reinii.harvest-billables.status');

/**
 * The first event fired when Stream Deck starts
 */
$SD.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }) => {
	console.log('Stream Deck connected!');
});

actionUpdateStatus.onKeyUp(({ action, context, device, event, payload }) => {
  updateStatus(context, payload.settings);
});

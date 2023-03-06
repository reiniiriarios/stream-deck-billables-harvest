/// <reference path="libs/js/property-inspector.js" />
/// <reference path="libs/js/utils.js" />

import config from '../config';

$PI.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }): void => {
  const { payload, context } = actionInfo;
  const form = document.getElementById('property-inspector');

  Utils.setFormValue(payload.settings, form);

  form.addEventListener(
    'input',
    Utils.debounce(150, () => {
      const value = Utils.getFormValue(form);
      $PI.setSettings(value);
    })
  );
});

$PI.onDidReceiveGlobalSettings(({ payload }): void => {
  console.log('onDidReceiveGlobalSettings', payload);
});
$PI.onDidReceiveSettings(config.appName + '.status', ({ payload }): void => {
  console.log('onDidReceiveSettings', payload);
});

/**
 * Provide window level functions to use in the external window
 * (this can be removed if the external window is not used)
 */
(window as any).sendToInspector = (data: any): void => {
  console.log(data);
};

document.getElementById('howto-button').addEventListener('click', () => {
  window.open('https://github.com/reiniiriarios/stream-deck-billables-harvest/#readme');
});

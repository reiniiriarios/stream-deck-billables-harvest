/// <reference path="libs/js/property-inspector.js" />
/// <reference path="libs/js/utils.js" />

import config from '../config.js';
import { getUserProjectAssignments } from './api/harvest';
import { ProjectAssignment, Settings, TaskAssignment } from './types';

$PI.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }): void => {
  const { payload, context } = actionInfo;
  const form = document.getElementById('property-inspector');

  setTaskOptions(payload.settings).then(() => {
    Utils.setFormValue(payload.settings, form);
  });

  form.addEventListener(
    'input',
    Utils.debounce(150, () => {
      const newSettings = Utils.getFormValue(form) as Settings;
      $PI.setSettings(newSettings);
    })
  );
});

$PI.onDidReceiveGlobalSettings(({ payload }): void => {
  console.log('onDidReceiveGlobalSettings', payload);
});
$PI.onDidReceiveSettings(config.appName + '.timer', ({ payload }): void => {
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

/**
 * Set <select> options for task selection.
 *
 * @param {Settings} settings
 */
const setTaskOptions = async (settings: Settings) => {
  try {
    if (!settings.harvestAccountId?.length || !settings.harvestAccountToken?.length) {
      throw new Error('EAUTH: Missing keys, unable to update task options.');
    }
    let select = document.getElementById('task');
    const projectAssignments = await getUserProjectAssignments(settings);
    projectAssignments.forEach((project_assignment: ProjectAssignment) => {
      // Project optgroup
      let optgroup = document.createElement('optgroup');
      optgroup.label = project_assignment.project.name;
      project_assignment.task_assignments.forEach((task_assignment: TaskAssignment) => {
        // Task assignment option
        let option = document.createElement('option');
        option.text = task_assignment.task.name;
        option.value = JSON.stringify({
          id: task_assignment.task.id,
          projectId: project_assignment.project.id,
        });
        optgroup.appendChild(option);
      });
      select.appendChild(optgroup);
    });
  }
  catch (e) {
    console.error(e);
  }
};

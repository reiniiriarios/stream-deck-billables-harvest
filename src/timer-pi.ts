/// <reference path="libs/js/property-inspector.js" />
/// <reference path="libs/js/utils.js" />

import config from '../config.js';
import { getUserProjectAssignments } from './api/harvest';
import { ProjectAssignment, Settings, TaskAssignment } from './types';
import { withDefaultSettings } from './settings';

$PI.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }): void => {
  const { payload, context } = actionInfo;
  const form = document.getElementById('property-inspector') as HTMLFormElement;
  let cachedTaskKey = '';

  const syncTaskOptions = async (settings: Partial<Settings>) => {
    const normalizedSettings = withDefaultSettings(settings);
    const taskKey = `${normalizedSettings.harvestAccountId}:${normalizedSettings.harvestAccountToken}`;
    if (taskKey === cachedTaskKey) {
      return;
    }
    cachedTaskKey = taskKey;
    await setTaskOptions(normalizedSettings);
    Utils.setFormValue(normalizedSettings, form);
  };

  const normalizedSettings = withDefaultSettings(payload.settings);
  Utils.setFormValue(normalizedSettings, form);
  $PI.setSettings(normalizedSettings);
  syncTaskOptions(normalizedSettings);

  form.addEventListener(
    'input',
    Utils.debounce(150, () => {
      const newSettings = withDefaultSettings(Utils.getFormValue(form) as Settings);
      $PI.setSettings(newSettings);
      syncTaskOptions(newSettings);
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
  let select = document.getElementById('task') as HTMLSelectElement;
  const currentTask = select.value;
  select.innerHTML = '<option value="">-- Select --</option>';

  try {
    if (!settings.harvestAccountId?.length || !settings.harvestAccountToken?.length) {
      throw new Error('EAUTH: Missing keys, unable to update task options.');
    }
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

    const hasCurrentTask = Array.from(select.options).some((option) => option.value === currentTask);
    if (currentTask && hasCurrentTask) {
      select.value = currentTask;
    }
  }
  catch (e) {
    console.error(e);
  }
};

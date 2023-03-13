import {
  createTimeEntry,
  getHarvestUserId,
  getTimeEntryForTask,
  restartTimeEntry,
  stopTimeEntry,
} from './api/harvest';
import { displayError, displayTimerStatus } from './display';
import { Settings } from './types';

/**
 * Update timer.
 *
 * Callback for Stream Deck action updates.
 *
 * @param {string} context
 * @param {Settings} settings
 */
export const updateTimer = async (context: string, settings: Settings) => {
  try {
    if (!settings.harvestAccountId.length || !settings.harvestAccountToken) {
      throw new Error('EAUTH: Missing keys, unable to display timer.');
    }
    if (!settings.task) {
      throw new Error('ETASK: No task selected.');
    }
    const userId: number = await getHarvestUserId(settings);
    const task: { id: number; projectId: number } = JSON.parse(settings.task);
    if (typeof task !== 'undefined' && typeof task.id !== 'undefined' && task.id) {
      const timeEntry = await getTimeEntryForTask(settings, userId, task.projectId, task.id);
      if (timeEntry) {
        displayTimerStatus(context, timeEntry.is_running, timeEntry.hours);
      } else {
        displayTimerStatus(context, false, 0);
      }
    }
  } catch (e) {
    displayError(context, e);
  }
};

/**
 * Stop or restart timer if one exists, otherwise create a new time entry.
 *
 * Callback for Stream Deck action button press.
 *
 * @param {string} context
 * @param {Settings} settings
 */
export const changeTimer = async (context: string, settings: Settings) => {
  try {
    if (!settings.harvestAccountId.length || !settings.harvestAccountToken) {
      throw new Error('EAUTH: Missing keys, unable to update timer.');
    }
    if (!settings.task) {
      throw new Error('ETASK: No task selected.');
    }
    const userId: number = await getHarvestUserId(settings);
    const task: { id: number; projectId: number } = JSON.parse(settings.task);
    if (typeof task !== 'undefined' && typeof task.id !== 'undefined' && task.id) {
      let timeEntry = await getTimeEntryForTask(settings, userId, task.projectId, task.id);
      if (timeEntry) {
        if (timeEntry.is_running) {
          await stopTimeEntry(settings, timeEntry.id);
          timeEntry.is_running = false;
        } else {
          await restartTimeEntry(settings, timeEntry.id);
          timeEntry.is_running = true;
        }
      } else {
        timeEntry = await createTimeEntry(settings, task.projectId, task.id);
      }
      displayTimerStatus(context, timeEntry.is_running, timeEntry.hours);
    }
  } catch (e) {
    displayError(context, e);
  }
};

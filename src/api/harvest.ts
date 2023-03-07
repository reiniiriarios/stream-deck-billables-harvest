import { getTodayUTCDate } from '../common';
import { ProjectAssignment, Settings, StartEndDates, TimeEntry } from '../types';

const harvestUrl = 'https://api.harvestapp.com/v2/';

/**
 * Fetch data from the harvest api.
 *
 * Fetches harvestUrl + path + ?arg1=val1&arg2=val2&etc
 *
 * @param {Settings} settings
 * @param {string} path
 * @param {object} args
 * @returns {Promise<any>} json response
 */
export const getHarvest = async (
  settings: Settings,
  path: string,
  args: object = null
): Promise<any> => {
  let url = harvestUrl + path;
  if (args) {
    let params = Object.keys(args)
      .map(function (key) {
        return key + '=' + args[key];
      })
      .join('&');
    url += '?' + params;
  }
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${settings.harvestAccountToken}`,
      'Harvest-Account-Id': settings.harvestAccountId,
    },
  }).then((res) => {
    if (res.status < 200 || res.status >= 300) {
      console.error(res);
      throw new Error('Error fetching data, check authentication tokens. Response: ' + res.status);
    }
    return res.json();
  });
  if (typeof response.error !== 'undefined') {
    console.error(response.error_description);
    throw new Error(response.error_description);
  }

  return response;
};

/**
 * Post data to harvest.
 *
 * Posts data to harvestUrl + path.
 *
 * @param {Settings} settings
 * @param {string} path
 * @param {object} data
 * @returns {Promise<any>} json response
 */
export const postHarvest = async (settings: Settings, path: string, data: object): Promise<any> => {
  let url = harvestUrl + path;
  console.log(url, data);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${settings.harvestAccountToken}`,
      'Harvest-Account-Id': settings.harvestAccountId,
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (res.status < 200 || res.status >= 300) {
      console.error(res);
      throw new Error('Error posting data, check authentication tokens. Response: ' + res.status);
    }
    return res.json();
  });
  if (typeof response.error !== 'undefined') {
    console.error(response.error_description);
    throw new Error(response.error_description);
  }

  return response;
};

/**
 * Patch an endpoint on the harvest api.
 *
 * Send a patch request to harvestUrl + path.
 *
 * @param {Settings} settings
 * @param {string} path
 * @returns {Promise<any>} json response
 */
export const patchHarvest = async (settings: Settings, path: string): Promise<any> => {
  let url = harvestUrl + path;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${settings.harvestAccountToken}`,
      'Harvest-Account-Id': settings.harvestAccountId,
    },
  }).then((res) => {
    if (res.status < 200 || res.status >= 300) {
      console.error(res);
      throw new Error('Error posting data, check authentication tokens. Response: ' + res.status);
    }
    return res.json();
  });
  if (typeof response.error !== 'undefined') {
    console.error(response.error_description);
    throw new Error(response.error_description);
  }

  return response;
};

/**
 * Get current user id.
 *
 * @param {Settings} settings
 * @returns {Promise<number>}
 */
export const getHarvestUserId = async (settings: Settings): Promise<number> => {
  const user = await getHarvest(settings, 'users/me');
  return user.id;
};

/**
 * Get time entries from harvest.
 *
 * @param {Settings} settings
 * @param {number} userId
 * @param {StartEndDates} startEnd
 * @returns {Promise<TimeEntry[]>}
 */
export const getTimeEntries = async (
  settings: Settings,
  userId: number,
  startEnd: StartEndDates
): Promise<TimeEntry[]> => {
  let timeEntries: TimeEntry[] = [];

  // Get tracked hours.
  const trackedHoursResponse = await getHarvest(settings, 'time_entries', {
    user_id: userId,
    from: startEnd.start.iso,
    to: startEnd.end.iso,
  });
  if (
    typeof trackedHoursResponse.time_entries !== 'undefined' &&
    trackedHoursResponse.time_entries.length
  ) {
    trackedHoursResponse.time_entries.forEach((entry: TimeEntry) => {
      timeEntries.push(entry);
    });
  }

  return timeEntries;
};

/**
 * Get specific time entry from harvest.
 *
 * @param {Settings} settings
 * @param {number} userId
 * @param {number} projectId
 * @param {number} taskId
 * @returns {Promise<TimeEntry>}
 */
export const getTimeEntryForTask = async (
  settings: Settings,
  userId: number,
  projectId: number,
  taskId: number
): Promise<TimeEntry> => {
  // Get tracked hours.
  const today = getTodayUTCDate();
  const timeEntriesResponse = await getHarvest(settings, 'time_entries', {
    user_id: userId,
    project_id: projectId,
    task_id: taskId,
    from: today,
    to: today,
  });
  if (
    typeof timeEntriesResponse.time_entries !== 'undefined' &&
    timeEntriesResponse.time_entries.length
  ) {
    // Return the first one found.
    // @todo Track this differently?
    return timeEntriesResponse.time_entries.pop();
  }

  return null;
};

/**
 * Create a time entry for a task.
 *
 * @param {Settings} settings
 * @param {number} projectId
 * @param {number} taskId
 * @returns {Promise<TimeEntry>}
 */
export const createTimeEntry = async (
  settings: Settings,
  projectId: number,
  taskId: number
): Promise<TimeEntry> => {
  const newTimeEntry = await postHarvest(settings, 'time_entries', {
    project_id: projectId,
    task_id: taskId,
    spent_date: getTodayUTCDate(),
  });
  if (typeof newTimeEntry.id === 'undefined' || !newTimeEntry.id) {
    throw new Error('Error creating time entry.');
  }

  return newTimeEntry;
};

/**
 * Restart a stopped time entry.
 *
 * @param {Settings} settings
 * @param {number} timeEntryId
 */
export const restartTimeEntry = async (settings: Settings, timeEntryId: number) => {
  const res = await patchHarvest(settings, 'time_entries/' + timeEntryId + '/restart');
  if (typeof res.id === 'undefined' || !res.id) {
    throw new Error('Possible error restarting time entry.');
  }
};

/**
 * Stop a stopped time entry.
 *
 * @param {Settings} settings
 * @param {number} timeEntryId
 */
export const stopTimeEntry = async (settings: Settings, timeEntryId: number) => {
  const res = await patchHarvest(settings, 'time_entries/' + timeEntryId + '/stop');
  if (typeof res.id === 'undefined' || !res.id) {
    throw new Error('Possible error stopping time entry.');
  }
};

/**
 * Get user project assignments from harvest.
 *
 * You must be an Administrator or Manager with permission to create and edit tasks in order to
 * interact with the /v2/tasks, /v2/user_assignments, or /v2/task_assignments endpoints. The
 * /v2/users/{USER_ID}/project_assignments endpoint is available for all users for their own
 * data by using `me` as the user id. Accessing data via user id at this endpoint requires
 * Administrator or Manager permissions.
 *
 * @param {Settings} settings
 * @returns {Promise<ProjectAssignment[]>}
 */
export const getUserProjectAssignments = async (
  settings: Settings
): Promise<ProjectAssignment[]> => {
  let projectAssignments: ProjectAssignment[] = [];

  const projectAssignmentsResponse = await getHarvest(settings, 'users/me/project_assignments', {
    is_active: true,
  });
  if (typeof projectAssignmentsResponse.error !== 'undefined') {
    throw new Error(projectAssignmentsResponse.error_description);
  }
  if (
    typeof projectAssignmentsResponse.project_assignments !== 'undefined' &&
    projectAssignmentsResponse.project_assignments.length
  ) {
    projectAssignmentsResponse.project_assignments.forEach((assignment: ProjectAssignment) => {
      projectAssignments.push(assignment);
    });
  }

  return projectAssignments;
};

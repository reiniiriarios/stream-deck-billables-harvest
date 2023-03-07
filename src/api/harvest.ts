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
    if (res.status != 200) {
      // Will return a 404 [sic] on invalid authentication.
      throw new Error('Error fetching data, check authentication tokens. Response: ' + res.status);
    }
    return res.json();
  });
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
  if (typeof trackedHoursResponse.error !== 'undefined') {
    throw new Error(trackedHoursResponse.error_description);
  }
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
export const getUserProjectAssignments = async (settings: Settings): Promise<ProjectAssignment[]> => {
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
}

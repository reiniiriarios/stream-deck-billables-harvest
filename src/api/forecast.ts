import { Assignment, Project, RemainingBudgetedHours, Settings, StartEndDates } from '../types';

const forecastUrl = 'https://api.forecastapp.com/';

/**
 * Fetch data from the forecast api.
 *
 * Fetches forecastUrl + path + ?arg1=val1&arg2=val2&etc
 *
 * @param {Settings} settings
 * @param {string} path
 * @param {object} args
 * @returns {Promise<any>} json response
 */
export const getForecast = async (
  settings: Settings,
  path: string,
  args: object = null
): Promise<any> => {
  let url = forecastUrl + path;
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
      'Forecast-Account-Id': settings.forecastAccountId,
      'User-Agent': 'Stream Deck Harvest Billables (github.com/reiniiriarios/stream-deck-billables-harvest)',
    },
  }).then((res) => {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('F0' + String(res.status).padStart(3, '0') + ': Error fetching data.');
    }
    return res.json();
  });
  if (typeof response.error !== 'undefined') {
    throw new Error('F0002: ' + response.error_description);
  }

  return response;
};

/**
 * Get current user id.
 *
 * @param {Settings} settings
 * @returns {Promise<number>}
 */
export const getForecastUserId = async (settings: Settings): Promise<number> => {
  const res = await getForecast(settings, 'whoami');
  return res.current_user.id;
};

/**
 * Get projects with remaining budgeted hours.
 *
 * @param {Settings} settings
 * @returns {Promise<Project[]>}
 */
export const getProjects = async (settings: Settings): Promise<Project[]> => {
  let projects = [];

  // Get projects.
  const resP = await getForecast(settings, 'projects');
  if (typeof resP.projects === 'undefined' || !resP.projects.length) {
    throw new Error('NOPRJ: No projects found in Forecast.');
  }
  resP.projects.forEach((project: Project) => {
    if (!project.archived) {
      projects[project.id] = project;
    }
  });

  // Get remaining budgeted hours.
  const resH = await getForecast(settings, 'aggregate/remaining_budgeted_hours');
  if (
    typeof resH.remaining_budgeted_hours !== 'undefined' &&
    resH.remaining_budgeted_hours.length
  ) {
    resH.remaining_budgeted_hours.forEach((hours: RemainingBudgetedHours) => {
      if (typeof projects[hours.project_id] !== 'undefined') {
        projects[hours.project_id].budget_by = hours.budget_by;
        projects[hours.project_id].billable = hours.budget_by !== 'none';
        projects[hours.project_id].hours = hours.hours;
      }
    });
  }

  return projects;
};

/**
 * Get assignments from forecast.
 *
 * @param {Settings} settings
 * @param {number} userId
 * @param {StartEndDates} startEnd
 * @returns {Promise<Assignment[]>}
 */
export const getAssignments = async (
  settings: Settings,
  userId: number,
  startEnd: StartEndDates
): Promise<Assignment[]> => {
  let assignments: Assignment[] = [];

  const res = await getForecast(settings, 'assignments', {
    person_id: userId,
    start_date: startEnd.start.iso,
    end_date: startEnd.end.iso,
    state: 'active',
  });
  if (typeof res.assignments !== 'undefined' && res.assignments.length) {
    res.assignments.forEach((assignment: Assignment) => {
      assignment.allocationHours = assignment.allocation ? assignment.allocation / 3600 : 0;
      assignments.push(assignment);
    });
  }

  return assignments;
};

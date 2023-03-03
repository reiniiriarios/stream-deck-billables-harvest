const forecastUrl = 'https://api.forecastapp.com/';

/**
 * Fetch data from the forecast api.
 *
 * Fetches forecastUrl + path + ?arg1=val1&arg2=val2&etc
 */
const getForecast = async (settings, path, args) => {
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
    },
  }).then((res) => {
    return res.json();
  });
  return response;
};

/**
 * Get current user id.
 */
const getForecastUserId = async (settings) => {
  const userResponse = await getForecast(settings, 'whoami');
  return userResponse.current_user.id;
};

/**
 * Get projects.
 */
const getProjects = async (settings) => {
  let projects = [];

  // Get projects.
  const projectsResponse = await getForecast(settings, 'projects');
  projectsResponse.projects.forEach((project) => {
    if (!project.archived) {
      projects[project.id] = project;
    }
  });

  // Get remaining budgeted hours.
  const hoursResponse = await getForecast(settings, 'aggregate/remaining_budgeted_hours');
  if (typeof hoursResponse.error !== 'undefined') {
    throw new Error(hoursResponse.error_description);
  }
  if (
    typeof hoursResponse.remaining_budgeted_hours !== 'undefined' &&
    hoursResponse.remaining_budgeted_hours.length
  ) {
    hoursResponse.remaining_budgeted_hours.forEach((hours) => {
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
 */
const getAssignments = async (settings, userId, startEnd) => {
  let assignments = [];

  const assignmentsResponse = await getForecast(settings, 'assignments', {
    person_id: userId,
    start_date: startEnd.start.iso,
    end_date: startEnd.end.iso,
    state: 'active',
  });
  if (typeof assignmentsResponse.error !== 'undefined') {
    throw new Error(assignmentsResponse.error_description);
  }
  if (
    typeof assignmentsResponse.assignments !== 'undefined' &&
    assignmentsResponse.assignments.length
  ) {
    assignmentsResponse.assignments.forEach((assignment) => {
      assignment.allocationHours = assignment.allocation ? assignment.allocation / 3600 : 0;
      assignments.push(assignment);
    });
  }

  return assignments;
};

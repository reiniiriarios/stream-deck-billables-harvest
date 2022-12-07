import {
  Assignment,
  Project,
  RemainingBudgetedHours,
  Settings,
  StartEndDates,
} from '../types'

const forecastUrl = 'https://api.forecastapp.com'

/**
 * Fetch data from the forecast api.
 *
 * Fetches forecastUrl + path + ?arg1=val1&arg2=val2&etc
 *
 * @param {Settings} settings
 * @param {string} path
 * @param {object} args
 * @returns {Promise<object[]>} json response
 */
export const getForecast = async (
  settings: Settings,
  path: string,
  args?: object
) => {
  let url = forecastUrl + path
  if (args) {
    let params = Object.keys(args)
      .map(function (key) {
        return key + '=' + args[key]
      })
      .join('&')
    url += '?' + params
  }
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${settings.harvestAccountToken}`,
      'Forecast-Account-Id': settings.forecastAccountId,
    },
  }).then((res) => {
    return res.json()
  })
  return response
}

/**
 * Get current user id.
 *
 * @param {Settings} settings
 * @returns {Promise<number>}
 */
export const getForecastUserId = async (
  settings: Settings
): Promise<number> => {
  const userResponse: { current_user: { id: number; account_ids: number[] } } =
    await getForecast(settings, '/whoami')
  return userResponse.current_user.id
}

/**
 * Get projects.
 *
 * @param {Settings} settings
 * @returns {Promise<Project[]>}
 */
export const getProjects = async (settings: Settings): Promise<Project[]> => {
  let projects: Project[] = []

  // Get projects.
  const projectsResponse = await getForecast(settings, '/projects')
  projectsResponse.projects.forEach((project: Project) => {
    if (!project.archived) {
      projects[project.id] = project
    }
  })

  // Get remaining budgeted hours.
  const hoursResponse = await getForecast(
    settings,
    '/aggregate/remaining_budgeted_hours'
  )
  if (typeof hoursResponse.error !== 'undefined') {
    throw new Error(hoursResponse.error_description)
  }
  if (
    typeof hoursResponse.remaining_budgeted_hours !== 'undefined' &&
    hoursResponse.remaining_budgeted_hours.length
  ) {
    hoursResponse.remaining_budgeted_hours.forEach(
      (hours: RemainingBudgetedHours) => {
        if (typeof projects[hours.project_id] !== 'undefined') {
          projects[hours.project_id].budget_by = hours.budget_by
          projects[hours.project_id].billable = hours.budget_by !== 'none'
          projects[hours.project_id].hours = hours.hours
        }
      }
    )
  }

  return projects
}

/**
 * Get assignments.
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
  let assignments: Assignment[] = []

  const assignmentsResponse = await getForecast(settings, '/assignments', {
    person_id: userId,
    start_date: startEnd.start.iso,
    end_date: startEnd.end.iso,
    state: 'active',
  })
  if (typeof assignmentsResponse.error !== 'undefined') {
    throw new Error(assignmentsResponse.error_description)
  }
  if (
    typeof assignmentsResponse.assignments !== 'undefined' &&
    assignmentsResponse.assignments.length
  ) {
    assignmentsResponse.assignments.forEach((assignment: Assignment) => {
      assignment.allocationHours = assignment.allocation ? assignment.allocation / 3600 : null
      assignments.push(assignment)
    })
  }

  return assignments
}

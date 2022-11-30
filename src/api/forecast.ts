import { Project, RemainingBudgetedHours, Settings } from '../types'

const forecastUrl = 'https://api.forecastapp.com'

const getForecast = async (settings: Settings, path: string, args?: object) => {
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

const getForecastData = async (settings: Settings) => {
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

export default getForecastData

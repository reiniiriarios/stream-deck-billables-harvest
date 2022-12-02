import { Settings, User, TimeEntry } from '../types'

const harvestUrl = 'https://api.harvestapp.com/v2'

/**
 * Fetch data from the harvest api.
 *
 * Fetches harvestUrl + path + ?arg1=val1&arg2=val2&etc
 *
 * @param {Settings} settings
 * @param {string} path
 * @param {object} args 
 * @returns {Promise<object[]>} json response
 */
export const getHarvest = async (
  settings: Settings,
  path: string,
  args?: object
) => {
  let url = harvestUrl + path
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
      'Harvest-Account-Id': settings.harvestAccountId,
    },
  }).then((res) => {
    return res.json()
  })
  return response
}

/**
 * Fetches data from harvest.
 *
 * @param {Settings} settings 
 * @param {number} userId 
 * @returns {Promise<TimeEntry[]>}
 */
export const getHarvestData = async (settings: Settings, userId: number): Promise<TimeEntry[]> => {
  let currentDate = new Date()
  // first day of the week = current day of the month - current day of the week
  const firstDay = currentDate.getDate() - currentDate.getDay()
  const lastDay = firstDay + 6

  let timeEntries: TimeEntry[] = []

  // Get tracked hours.
  const trackedHoursResponse = await getHarvest(settings, '/time_entries', {
    user_id: userId,
    from: new Date(currentDate.setDate(firstDay)).toISOString(),
    to: new Date(currentDate.setDate(lastDay)).toISOString(),
  })
  if (typeof trackedHoursResponse.error !== 'undefined') {
    throw new Error(trackedHoursResponse.error_description)
  }
  if (
    typeof trackedHoursResponse.time_entries !== 'undefined' &&
    trackedHoursResponse.time_entries.length
  ) {
    trackedHoursResponse.time_entries.forEach((entry: TimeEntry) => {
      timeEntries.push(entry)
    })
  }

  return timeEntries
}

/**
 * Fetches data from harvest.
 *
 * @param {Settings} settings 
 * @returns {Promise<number>}
 */
export const getHarvestUserId = async (settings: Settings): Promise<number> => {
  const user: User = await getHarvest(settings, '/users/me')
  return user.id
}

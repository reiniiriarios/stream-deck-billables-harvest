import { Settings, User, TimeEntry } from '../types'

const harvestUrl = 'https://api.harvestapp.com/v2'

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

export const getHarvestData = async (settings: Settings, userId: number) => {
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

export const getHarvestUserId = async (settings: Settings) => {
  const user: User = await getHarvest(settings, '/users/me')
  return user.id
}

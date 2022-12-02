import { getForecastData } from './api/forecast'
import { getHarvestUserId, getHarvestData } from './api/harvest'
import { HoursSchedule, Project, Settings, TimeEntry } from './types'

/**
 * Callback for Stream Deck action.
 *
 * @param {Settings} settings
 */
export const updateStatus = async (settings: Settings) => {
  const data = {}
  try {
    const userId: number = await getHarvestUserId(settings)
    const timeEntries: TimeEntry[] = await getHarvestData(settings, userId)
    const projects: Project[] = await getForecastData(settings)

    projects.forEach((project: Project, id: number) => {
      projects[id].hours_logged = getTotalLoggedHours(timeEntries, id)
      projects[id].hours_schedule = getLoggedHoursSchedule(timeEntries, id)
    })
  } catch (e) {
    // @todo Handle errors.
    console.error(e)
  }

  // do things
}

/**
 * Get total logged hours for a project from a list of time entries.
 *
 * @param {TimeEntry[]} timeEntries
 * @param {number} projectId
 * @param {boolean} billable null = all entries, true = billable entries only, false = non-billable
 * @returns {number}
 */
export const getTotalLoggedHours = (
  timeEntries: TimeEntry[],
  projectId: number,
  billable: boolean = null
): number => {
  let hours: number = 0
  timeEntries.forEach((timeEntry: TimeEntry) => {
    if (timeEntry.project.id === projectId) {
      if (
        billable === null ||
        (billable && timeEntry.billable) ||
        (!billable && !timeEntry.billable)
      ) {
        hours += timeEntry.hours
      }
    }
  })
  return hours
}

/**
 * Get a week's schedule of logged hours for a project from a list of time entries.
 *
 * This function only sorts data by day of the week. All data must be from the same week
 * for an accurate schedule.
 *
 * @param {TimeEntry[]} timeEntries
 * @param {number} projectId
 * @param {boolean} billable null = all entries, true = billable entries only, false = non-billable
 * @returns {HoursSchedule}
 */
export const getLoggedHoursSchedule = (
  timeEntries: TimeEntry[],
  projectId: number,
  billable: boolean = null
): HoursSchedule => {
  let schedule: HoursSchedule = Array(7).fill(0)
  timeEntries.forEach((timeEntry: TimeEntry) => {
    if (timeEntry.project.id === projectId) {
      if (
        billable === null ||
        (billable && timeEntry.billable) ||
        (!billable && !timeEntry.billable)
      ) {
        let day: number = new Date(timeEntry.created_at).getDay()
        schedule[day] += timeEntry.hours
      }
    }
  })
  return schedule
}

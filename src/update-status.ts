import { getProjects } from './api/forecast'
import { getHarvestUserId, getTimeEntries } from './api/harvest'
import {
  HoursSchedule,
  Project,
  Settings,
  StartEndDates,
  TimeEntry,
} from './types'

/**
 * Callback for Stream Deck action.
 *
 * @param {Settings} settings
 */
export const updateStatus = async (settings: Settings) => {
  const data = {}
  try {
    const startEnd: StartEndDates = getStartEndDates()
    const userId: number = await getHarvestUserId(settings)
    const timeEntries: TimeEntry[] = await getTimeEntries(
      settings,
      userId,
      startEnd
    )
    const projects: Project[] = await getProjects(settings)

    projects.forEach((project: Project, id: number) => {
      projects[id].hours_logged = getTotalLoggedHours(timeEntries, id, true)
      projects[id].hours_schedule = getLoggedHoursSchedule(
        timeEntries,
        id,
        true
      )
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

/**
 * Get start and end dates of current week in ISO 8601.
 *
 * @returns {StartEndDates}
 */
export const getStartEndDates = (): StartEndDates => {
  let currentDate = new Date()
  // first day of the week = current day of the month - current day of the week
  const firstDay = currentDate.getDate() - currentDate.getDay()
  const lastDay = firstDay + 6

  let start = new Date(currentDate)
  let end = new Date(currentDate)
  start.setDate(start.getDate() + firstDay)
  end.setDate(end.getDate() + lastDay)

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  }
}

import { describe, expect, test } from '@jest/globals'
import { Project, StartEndDates, TimeEntry } from '../src/types'
import testSettings from './settings'
import { fakeProject, fakeTimeEntries } from './test-data'
import { getTotalLoggedHours, getLoggedHoursSchedule, getStartEndDates } from '../src/update-status'

describe('update status', () => {
  test('get total logged hours', () => {
    const totalHours = getTotalLoggedHours(fakeTimeEntries, fakeProject.id)
    expect(totalHours).toBe(3)
    const totalHoursBillable = getTotalLoggedHours(fakeTimeEntries, fakeProject.id, true)
    expect(totalHoursBillable).toBe(2)
    const totalHoursNonBillable = getTotalLoggedHours(fakeTimeEntries, fakeProject.id, false)
    expect(totalHoursNonBillable).toBe(1)
  })

  test('get logged hours schedule', () => {
    const schedule = getLoggedHoursSchedule(fakeTimeEntries, fakeProject.id)
    expect(schedule[0]).toBe(0)
    expect(schedule[1]).toBe(2)
    expect(schedule[2]).toBe(1)
    expect(schedule[3]).toBe(0)
    const scheduleBillable = getLoggedHoursSchedule(fakeTimeEntries, fakeProject.id, true)
    expect(scheduleBillable[0]).toBe(0)
    expect(scheduleBillable[1]).toBe(2)
    expect(scheduleBillable[2]).toBe(0)
    expect(scheduleBillable[3]).toBe(0)
    const scheduleNonBillable = getLoggedHoursSchedule(fakeTimeEntries, fakeProject.id, false)
    expect(scheduleNonBillable[0]).toBe(0)
    expect(scheduleNonBillable[1]).toBe(0)
    expect(scheduleNonBillable[2]).toBe(1)
    expect(scheduleNonBillable[3]).toBe(0)
  })

  test('start and end dates', () => {
    const startEnd: StartEndDates = getStartEndDates()
    const now = Date.now()
    const startTime = new Date(startEnd.start).getTime()
    const endTime = new Date(startEnd.end).getTime()
    expect(startTime).toBeLessThan(now)
    expect(endTime).toBeGreaterThan(now)
  })
})

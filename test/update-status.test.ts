import { describe, expect, test } from '@jest/globals'
import { Project, TimeEntry } from '../src/types'
import testSettings from './settings'
import { fakeProject, fakeTimeEntries } from './test-data'
import { getTotalLoggedHours, getLoggedHoursSchedule } from '../src/update-status'

describe('update status', () => {
  test('get total logged hours', () => {
    const totalHours = getTotalLoggedHours(fakeTimeEntries, fakeProject.id)
    expect(totalHours).toBe(2)
  })

  test('get logged hours schedule', () => {
    const schedule = getLoggedHoursSchedule(fakeTimeEntries, fakeProject.id)
    expect(schedule[0]).toBe(0)
    expect(schedule[1]).toBe(1)
    expect(schedule[2]).toBe(1)
    expect(schedule[3]).toBe(0)
  })
})

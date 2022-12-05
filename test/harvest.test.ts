import { describe, expect, test } from '@jest/globals'
import { TimeEntry } from '../src/types'
import testSettings from './settings'
import { getHarvestUserId, getTimeEntries } from '../src/api/harvest'
import { getStartEndDates } from '../src/update-status'

describe('get harvest data', () => {
  let timeEntries: TimeEntry[] = []

  let userId: number
  test('get user id', async () => {
    userId = await getHarvestUserId(testSettings)
    expect(userId).toBeGreaterThan(0)
  })

  test('data fetches', async () => {
    timeEntries = await getTimeEntries(testSettings, userId, getStartEndDates())
    // console.log(timeEntries)
    expect(timeEntries.length).toBeGreaterThanOrEqual(0)
  })

  test('data type matches', () => {
    const firstTimeEntry: TimeEntry = timeEntries.pop()
    const emptyTimeEntry: TimeEntry = new TimeEntry()
    for (const prop in emptyTimeEntry) {
      expect(firstTimeEntry.hasOwnProperty(prop)).toBeTruthy()
    }
  })
})

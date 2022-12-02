import { describe, expect, test } from '@jest/globals'
import { TimeEntry } from '../src/types'
import testSettings from './settings'
import { getHarvestUserId, getHarvestData } from '../src/api/harvest'

describe('get harvest data', () => {
  let timeEntries: TimeEntry[] = []

  let userId: number
  test('get user id', async () => {
    userId = await getHarvestUserId(testSettings)
    expect(userId).toBeGreaterThan(0)
  })
  if (!userId) return

  test('data fetches', async () => {
    timeEntries = await getHarvestData(testSettings, userId)
    // console.log(timeEntries)
    expect(timeEntries.length).toBeGreaterThanOrEqual(0)
  })
  if (!timeEntries.length) return

  test('data type matches', () => {
    const firstTimeEntry: TimeEntry = timeEntries.pop()
    const emptyTimeEntry: TimeEntry = new TimeEntry()
    for (const prop in emptyTimeEntry) {
      expect(firstTimeEntry.hasOwnProperty(prop)).toBeTruthy()
    }
  })
})

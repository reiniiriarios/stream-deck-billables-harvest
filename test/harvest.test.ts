import { describe, expect, test } from '@jest/globals'
import { TimeEntry } from '../src/types'
import testSettings from './settings'
import getHarvestData from '../src/api/harvest'

describe('get harvest data', () => {
  let timeEntries: TimeEntry[] = []

  test('data fetches', async () => {
    timeEntries = await getHarvestData(testSettings)
    // console.log(timeEntries)
    expect(timeEntries.length).toBeGreaterThanOrEqual(0)
  })

  if (timeEntries.length) {
    test('data type matches', () => {
      const firstTimeEntry: TimeEntry = timeEntries.pop()
      const emptyTimeEntry: TimeEntry = new TimeEntry()
      for (const prop in emptyTimeEntry) {
        expect(firstTimeEntry.hasOwnProperty(prop)).toBeTruthy()
      }
    })
  }
})

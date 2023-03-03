const { describe, expect, test } = require('@jest/globals');
const testSettings = require('./settings');
const { fakeTimeEntries } = require('./test-data');
const {
  getHarvestUserId,
  getTimeEntries,
} = require('../me.reinii.harvest-billables.sdPlugin/api/harvest');
const { getStartEndDates } = require('../me.reinii.harvest-billables.sdPlugin/update-status');

describe('get harvest data', () => {
  let timeEntries = [];

  let userId;
  test('get user id', async () => {
    userId = await getHarvestUserId(testSettings);
    expect(userId).toBeGreaterThan(0);
  });

  test('data fetches', async () => {
    timeEntries = await getTimeEntries(testSettings, userId, getStartEndDates());
    // console.log(timeEntries)
    expect(timeEntries.length).toBeGreaterThanOrEqual(0);
  });

  test('data type matches', () => {
    const firstTimeEntry = timeEntries.pop();
    for (const prop in fakeTimeEntries[0]) {
      expect(firstTimeEntry.hasOwnProperty(prop)).toBeTruthy();
    }
  });
});

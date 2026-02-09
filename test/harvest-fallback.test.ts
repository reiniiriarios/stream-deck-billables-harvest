import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { getTimeEntries } from '../src/api/harvest';
import { HourType, Settings, StartEndDates, TimeEntry } from '../src/types';

describe('harvest fallback queries', () => {
  const originalFetch = global.fetch;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  test('falls back after H0400 and filters entries to current user', async () => {
    const settings: Settings = {
      harvestAccountToken: 'token',
      harvestAccountId: 'account-id',
      forecastAccountId: '',
      billable: HourType.Both,
    };
    const startEnd: StartEndDates = {
      start: { date: new Date(2026, 1, 1, 0, 0, 0, 0), iso: '2026-02-01T00:00:00.000-0500' },
      end: { date: new Date(2026, 1, 1, 23, 59, 59, 999), iso: '2026-02-01T23:59:59.999-0500' },
    };

    const entryForUser = {
      id: 1,
      user: { id: 12345, name: 'User A' },
      hours: 1,
      billable: true,
    } as TimeEntry;
    const entryForOtherUser = {
      id: 2,
      user: { id: 99999, name: 'User B' },
      hours: 8,
      billable: true,
    } as TimeEntry;

    fetchMock
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 400,
          text: async () => 'Bad Request',
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          json: async () => ({
            time_entries: [entryForUser, entryForOtherUser],
          }),
        })
      );

    const entries = await getTimeEntries(settings, 12345, startEnd);

    expect(entries).toHaveLength(1);
    expect(entries[0].id).toBe(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

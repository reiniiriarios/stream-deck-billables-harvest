import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { getTimeEntries } from '../src/api/harvest';
import { HourType, Settings, StartEndDates } from '../src/types';

describe('harvest query format', () => {
  const originalFetch = global.fetch;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: async () => ({ time_entries: [] }),
      })
    );
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  test('time_entries query uses YYYY-MM-DD dates for from/to', async () => {
    const settings: Settings = {
      harvestAccountToken: 'token',
      harvestAccountId: 'account-id',
      forecastAccountId: '',
      billable: HourType.Both,
    };
    const startEnd: StartEndDates = {
      start: {
        date: new Date(2026, 1, 1, 0, 0, 0, 0),
        iso: '2026-02-01T00:00:00.000-0500',
      },
      end: {
        date: new Date(2026, 1, 7, 23, 59, 59, 999),
        iso: '2026-02-07T23:59:59.999-0500',
      },
    };

    await getTimeEntries(settings, 12345, startEnd);

    const calls = fetchMock.mock.calls;
    expect(calls.length).toBe(1);
    const [url] = calls[0];
    const parsedUrl = new URL(url as string);
    expect(parsedUrl.searchParams.get('from')).toBe('2026-02-01');
    expect(parsedUrl.searchParams.get('to')).toBe('2026-02-07');
  });
});

import { describe, expect, test } from '@jest/globals';
import { getFetchIntervalMilliseconds, withDefaultSettings } from '../src/settings';
import { ButtonAction, HourType, TimeFormat, TimePeriod } from '../src/types';

describe('settings helpers', () => {
  test('applies defaults when settings are missing', () => {
    const settings = withDefaultSettings();

    expect(settings.harvestAccountToken).toBe('');
    expect(settings.harvestAccountId).toBe('');
    expect(settings.forecastAccountId).toBe('');
    expect(settings.forecastApiToken).toBe('');
    expect(settings.task).toBe('');
    expect(settings.billable).toBe(HourType.Both);
    expect(settings.timeFormat).toBe(TimeFormat.HourDecimal);
    expect(settings.timePeriod).toBe(TimePeriod.Week);
    expect(settings.buttonAction).toBe(ButtonAction.Update);
    expect(settings.fetchInterval).toBe('1');
  });

  test('normalizes invalid interval values', () => {
    expect(getFetchIntervalMilliseconds({ fetchInterval: undefined })).toBe(60000);
    expect(getFetchIntervalMilliseconds({ fetchInterval: 'abc' })).toBe(60000);
    expect(getFetchIntervalMilliseconds({ fetchInterval: '0' })).toBe(60000);
    expect(getFetchIntervalMilliseconds({ fetchInterval: '2000' })).toBe(86400000);
    expect(getFetchIntervalMilliseconds({ fetchInterval: '15' })).toBe(900000);
  });

  test('keeps valid values', () => {
    const settings = withDefaultSettings({
      harvestAccountToken: 'token',
      harvestAccountId: '123',
      forecastAccountId: '456',
      forecastApiToken: 'forecast-token',
      task: '{"id":1,"projectId":2}',
      billable: HourType.NonBillable,
      timeFormat: TimeFormat.HoursMinutesPadded,
      timePeriod: TimePeriod.Day,
      buttonAction: ButtonAction.OpenForecast,
      fetchInterval: '5',
    });

    expect(settings.harvestAccountToken).toBe('token');
    expect(settings.harvestAccountId).toBe('123');
    expect(settings.forecastAccountId).toBe('456');
    expect(settings.forecastApiToken).toBe('forecast-token');
    expect(settings.task).toBe('{"id":1,"projectId":2}');
    expect(settings.billable).toBe(HourType.NonBillable);
    expect(settings.timeFormat).toBe(TimeFormat.HoursMinutesPadded);
    expect(settings.timePeriod).toBe(TimePeriod.Day);
    expect(settings.buttonAction).toBe(ButtonAction.OpenForecast);
    expect(settings.fetchInterval).toBe('5');
  });
});

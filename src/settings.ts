import { ButtonAction, HourType, Settings, TimeFormat, TimePeriod } from './types';

const DEFAULT_FETCH_INTERVAL_MINUTES = 1;
const MAX_FETCH_INTERVAL_MINUTES = 1440;

const normalizeHourType = (value: unknown): HourType => {
  switch (value) {
    case HourType.Billable:
    case HourType.NonBillable:
    case HourType.Both:
      return value;
    default:
      return HourType.Both;
  }
};

const normalizeTimeFormat = (value: unknown): TimeFormat => {
  switch (value) {
    case TimeFormat.AlwaysHours:
    case TimeFormat.AlwaysMinutes:
    case TimeFormat.HoursMinutes:
    case TimeFormat.HoursMinutesPadded:
    case TimeFormat.HourDecimal:
      return value;
    default:
      return TimeFormat.HourDecimal;
  }
};

const normalizeTimePeriod = (value: unknown): TimePeriod => {
  switch (value) {
    case TimePeriod.Day:
    case TimePeriod.Week:
      return value;
    default:
      return TimePeriod.Week;
  }
};

const normalizeButtonAction = (value: unknown): ButtonAction => {
  switch (value) {
    case ButtonAction.OpenHarvest:
    case ButtonAction.OpenForecast:
    case ButtonAction.Update:
      return value;
    default:
      return ButtonAction.Update;
  }
};

export const getFetchIntervalMinutes = (value: unknown): number => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || Number.isNaN(parsed)) {
    return DEFAULT_FETCH_INTERVAL_MINUTES;
  }
  if (parsed < DEFAULT_FETCH_INTERVAL_MINUTES) {
    return DEFAULT_FETCH_INTERVAL_MINUTES;
  }
  if (parsed > MAX_FETCH_INTERVAL_MINUTES) {
    return MAX_FETCH_INTERVAL_MINUTES;
  }
  return parsed;
};

export const getFetchIntervalMilliseconds = (settings: Partial<Settings> = {}): number => {
  return getFetchIntervalMinutes(settings.fetchInterval) * 60000;
};

export const withDefaultSettings = (settings: Partial<Settings> = {}): Settings => {
  return {
    harvestAccountToken: settings.harvestAccountToken ?? '',
    harvestAccountId: settings.harvestAccountId ?? '',
    forecastAccountId: settings.forecastAccountId ?? '',
    forecastApiToken: settings.forecastApiToken ?? '',
    task: settings.task ?? '',
    billable: normalizeHourType(settings.billable),
    timeFormat: normalizeTimeFormat(settings.timeFormat),
    timePeriod: normalizeTimePeriod(settings.timePeriod),
    buttonAction: normalizeButtonAction(settings.buttonAction),
    fetchInterval: String(getFetchIntervalMinutes(settings.fetchInterval)),
  };
};

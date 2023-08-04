import { describe, expect, test } from '@jest/globals';
import { formatHours, formatTimer } from '../src/display';
import { TimeFormat } from '../src/types';

// Test formatting hours for pie chart.
// Positive and negative are flipped to display remaining time.
describe('formatHours', () => {
  test('positive hours', () => {
    expect(formatHours(-1.1275)).toBe('+1.13h');
  });

  test('negative hours', () => {
    expect(formatHours(1.1275)).toBe('-1.13h');
  });

  test('positive minutes', () => {
    expect(formatHours(-0.1275)).toBe('+8m');
  });

  test('negative minutes', () => {
    expect(formatHours(0.1275)).toBe('-8m');
  });
});

// Test formatting hours for timers.
describe('formatTimer', () => {
  test('HourDecimal', () => {
    expect(formatTimer(1.1275, TimeFormat.HourDecimal)).toBe('1.13h');
    expect(formatTimer(0.1275, TimeFormat.HourDecimal)).toBe('8m');
  });

  test('AlwaysHours', () => {
    expect(formatTimer(1.1275, TimeFormat.AlwaysHours)).toBe('1.13h');
    expect(formatTimer(0.1275, TimeFormat.AlwaysHours)).toBe('0.13h');
  });

  test('AlwaysMinutes', () => {
    expect(formatTimer(1.1275, TimeFormat.AlwaysMinutes)).toBe('68m');
    expect(formatTimer(0.1275, TimeFormat.AlwaysMinutes)).toBe('8m');
  });

  test('HoursMinutes', () => {
    expect(formatTimer(1.1275, TimeFormat.HoursMinutes)).toBe('1:08');
    expect(formatTimer(0.1275, TimeFormat.HoursMinutes)).toBe('0:08');
  });

  test('HoursMinutesPadded', () => {
    expect(formatTimer(10.1275, TimeFormat.HoursMinutesPadded)).toBe('10:08');
    expect(formatTimer(1.1275, TimeFormat.HoursMinutesPadded)).toBe('01:08');
    expect(formatTimer(0.1275, TimeFormat.HoursMinutesPadded)).toBe('00:08');
  });
});

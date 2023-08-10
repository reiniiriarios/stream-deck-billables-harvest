import { describe, expect, test } from '@jest/globals';
import { getIsoLocalTimezone, getLocalTimezone, getTimezone, getTodaysDate } from '../src/common';

describe('getTimezone', () => {
  test('format matches -0700', () => {
    let tz = getTimezone(new Date());
    expect(tz).toMatch(/^[+-][0-9]{4}$/);
  });
});

describe('getLocalTimezone', () => {
  test('format matches -0700', () => {
    let tz = getLocalTimezone();
    expect(tz).toMatch(/^[+-][0-9]{4}$/);
  });
});

describe('getIsoLocalTimezone', () => {
  test('format matches 2023-04-16T00:00:00.000-0700', () => {
    let t = getIsoLocalTimezone(new Date());
    expect(t).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}[+-]\d{4}$/);
  });
});

describe('getTodaysDate', () => {
  test('format matches 2023-04-16', () => {
    let t = getTodaysDate();
    expect(t).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

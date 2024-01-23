import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import timezonedDate from 'timezoned-date';
import { getIsoLocalTimezone, getLocalTimezone, getStartEndDates, getTimezone, getTodayAsStartEndDates, getTodaysDate } from '../src/common';

// Cache and reset Date before and after tests.
let originalDate: DateConstructor;
beforeAll(() => {
  originalDate = Date;
});
afterAll(() => {
  Date = originalDate;
});

describe('getTimezone', () => {
  test('-0700', () => {
    Date = timezonedDate.makeConstructor(-420);
    let tz = getTimezone(new Date());
    expect(tz).toBe('-0700');
  });
  test('+0400', () => {
    Date = timezonedDate.makeConstructor(240);
    let tz = getTimezone(new Date());
    expect(tz).toBe('+0400');
  });
  test('UTC', () => {
    Date = timezonedDate.makeConstructor(0);
    let tz = getTimezone(new Date());
    expect(tz).toBe('Z');
  });
});

describe('getLocalTimezone', () => {
  test('-0700', () => {
    Date = timezonedDate.makeConstructor(-420);
    let tz = getLocalTimezone();
    expect(tz).toBe('-0700');
  });
  test('+0400', () => {
    Date = timezonedDate.makeConstructor(240);
    let tz = getLocalTimezone();
    expect(tz).toBe('+0400');
  });
  test('UTC', () => {
    Date = timezonedDate.makeConstructor(0);
    let tz = getLocalTimezone();
    expect(tz).toBe('Z');
  });
});

describe('getIsoLocalTimezone', () => {
  test('matches 2023-04-16T00:00:00.000-0700', () => {
    Date = timezonedDate.makeConstructor(-420);
    let t = getIsoLocalTimezone(new Date());
    expect(t).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\-0700$/);
  });

  test('matches 2023-04-16T00:00:00.000+0400', () => {
    Date = timezonedDate.makeConstructor(240);
    let t = getIsoLocalTimezone(new Date());
    expect(t).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\+0400$/);
  });

  test('matches 2023-04-16T00:00:00.000Z', () => {
    Date = timezonedDate.makeConstructor(0);
    let t = getIsoLocalTimezone(new Date());
    expect(t).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
  });
});

describe('getTodaysDate', () => {
  test('format matches 2023-04-16', () => {
    let t = getTodaysDate();
    expect(t).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('getStartEndDates', () => {
  test('format matches -0700', () => {
    Date = timezonedDate.makeConstructor(-420);
    let se = getStartEndDates();
    expect(se.start.iso).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00.000\-0700$/);
    expect(se.end.iso).toMatch(/^\d{4}-\d{2}-\d{2}T23:59:59.999\-0700$/);
  });

  test('format matches +0400', () => {
    Date = timezonedDate.makeConstructor(240);
    let se = getStartEndDates();
    expect(se.start.iso).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00.000\+0400$/);
    expect(se.end.iso).toMatch(/^\d{4}-\d{2}-\d{2}T23:59:59.999\+0400$/);
  });

  test('format matches UTC', () => {
    Date = timezonedDate.makeConstructor(0);
    let se = getStartEndDates();
    expect(se.start.iso).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00.000Z$/);
    expect(se.end.iso).toMatch(/^\d{4}-\d{2}-\d{2}T23:59:59.999Z$/);
  });
});

describe('getTodayAsStartEndDates', () => {
  test('format matches -0700', () => {
    Date = timezonedDate.makeConstructor(-420);
    let se = getTodayAsStartEndDates();
    expect(se.start.iso).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00.000\-0700$/);
    expect(se.end.iso).toMatch(/^\d{4}-\d{2}-\d{2}T23:59:59.999\-0700$/);
  });

  test('format matches +0400', () => {
    Date = timezonedDate.makeConstructor(240);
    let se = getTodayAsStartEndDates();
    expect(se.start.iso).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00.000\+0400$/);
    expect(se.end.iso).toMatch(/^\d{4}-\d{2}-\d{2}T23:59:59.999\+0400$/);
  });

  test('format matches UTC', () => {
    Date = timezonedDate.makeConstructor(0);
    let se = getTodayAsStartEndDates();
    expect(se.start.iso).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00.000Z$/);
    expect(se.end.iso).toMatch(/^\d{4}-\d{2}-\d{2}T23:59:59.999Z$/);
  });
});

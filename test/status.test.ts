import { describe, expect, test } from '@jest/globals';
import { HourType, Project, StartEndDates } from '../src/types';
import { fakeAssignments, fakeProject, fakeStartEnd, fakeTimeEntries } from './test-data';
import {
  getTotalLoggedHours,
  getLoggedHoursSchedule,
  getAssignedHoursSchedule,
} from '../src/status';
import { getStartEndDates } from '../src/common';

describe('update status', () => {
  test('get total logged hours', () => {
    const totalHours = getTotalLoggedHours(fakeTimeEntries, fakeProject.id, HourType.Both);
    expect(totalHours).toBe(3);

    // Only billable hours.
    const totalHoursBillable = getTotalLoggedHours(fakeTimeEntries, fakeProject.id, HourType.Billable);
    expect(totalHoursBillable).toBe(2);

    // Not including billable hours.
    const totalHoursNonBillable = getTotalLoggedHours(fakeTimeEntries, fakeProject.id, HourType.NonBillable);
    expect(totalHoursNonBillable).toBe(1);
  });

  test('get logged hours schedule', () => {
    const schedule = getLoggedHoursSchedule(fakeTimeEntries, fakeProject.id);
    expect(schedule[0]).toBe(0);
    expect(schedule[1]).toBe(2);
    expect(schedule[2]).toBe(1);
    expect(schedule[3]).toBe(0);

    // Only billable hours.
    const scheduleBillable = getLoggedHoursSchedule(fakeTimeEntries, fakeProject.id, true);
    expect(scheduleBillable[0]).toBe(0);
    expect(scheduleBillable[1]).toBe(2);
    expect(scheduleBillable[2]).toBe(0);
    expect(scheduleBillable[3]).toBe(0);

    // Not including billable hours.
    const scheduleNonBillable = getLoggedHoursSchedule(fakeTimeEntries, fakeProject.id, false);
    expect(scheduleNonBillable[0]).toBe(0);
    expect(scheduleNonBillable[1]).toBe(0);
    expect(scheduleNonBillable[2]).toBe(1);
    expect(scheduleNonBillable[3]).toBe(0);
  });

  test('start and end dates', () => {
    const startEnd: StartEndDates = getStartEndDates();
    const now = Date.now();
    expect(startEnd.start.date.getTime()).toBeLessThan(now);
    expect(startEnd.end.date.getTime()).toBeGreaterThan(now);
  });

  test('get assigned hours schedule', () => {
    let fakeProjects: Project[] = [];
    fakeProjects[fakeProject.id] = fakeProject;

    // Get all assigned hours from data.
    const schedule = getAssignedHoursSchedule(
      fakeAssignments,
      fakeStartEnd,
      fakeProjects,
      fakeProject.id,
      HourType.Both
    );
    expect(schedule[0]).toBe(0); // Sunday
    expect(schedule[1]).toBe(0); // Monday, fakeStartEnd starts on Tuesday
    expect(schedule[2]).toBe(7.2);
    expect(schedule[3]).toBe(7.2);
    expect(schedule[4]).toBe(7.2);
    expect(schedule[5]).toBe(7.2);
    expect(schedule[6]).toBe(0); // Saturday

    // The project id here doesn't match, so the schedule should be empty.
    const scheduleNoProjectMatch = getAssignedHoursSchedule(
      fakeAssignments,
      fakeStartEnd,
      fakeProjects,
      123,
      HourType.Both
    );
    expect(scheduleNoProjectMatch[0]).toBe(0);
    expect(scheduleNoProjectMatch[1]).toBe(0);
    expect(scheduleNoProjectMatch[2]).toBe(0);
    expect(scheduleNoProjectMatch[3]).toBe(0);
    expect(scheduleNoProjectMatch[4]).toBe(0);
    expect(scheduleNoProjectMatch[5]).toBe(0);
    expect(scheduleNoProjectMatch[6]).toBe(0);

    // Not including billable hours.
    const scheduleNoBillables = getAssignedHoursSchedule(
      fakeAssignments,
      fakeStartEnd,
      fakeProjects,
      fakeProject.id,
      HourType.NonBillable
    );
    expect(scheduleNoBillables[0]).toBe(0);
    expect(scheduleNoBillables[1]).toBe(0);
    expect(scheduleNoBillables[2]).toBe(0);
    expect(scheduleNoBillables[3]).toBe(0);
    expect(scheduleNoBillables[4]).toBe(0);
    expect(scheduleNoBillables[5]).toBe(0);
    expect(scheduleNoBillables[6]).toBe(0);

    // Only billable hours.
    const scheduleBillables = getAssignedHoursSchedule(
      fakeAssignments,
      fakeStartEnd,
      fakeProjects,
      fakeProject.id,
      HourType.Billable
    );
    expect(scheduleBillables[0]).toBe(0);
    expect(scheduleBillables[1]).toBe(0);
    expect(scheduleBillables[2]).toBe(7.2);
    expect(scheduleBillables[3]).toBe(7.2);
    expect(scheduleBillables[4]).toBe(7.2);
    expect(scheduleBillables[5]).toBe(7.2);
    expect(scheduleBillables[6]).toBe(0);
  });
});

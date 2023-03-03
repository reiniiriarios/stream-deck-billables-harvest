import { describe, expect, test } from '@jest/globals';
import { fakeAssignments, fakeProject, fakeStartEnd, fakeTimeEntries } from './test-data';
import {
  getTotalLoggedHours,
  getLoggedHoursSchedule,
  getStartEndDates,
  getAssignedHoursSchedule,
  updateStatus,
} from '../me.reinii.harvest-billables.sdPlugin/update-status';
import testSettings from './settings';

describe('update status', () => {
  test('get total logged hours', () => {
    const totalHours = getTotalLoggedHours(fakeTimeEntries, fakeProject.id);
    expect(totalHours).toBe(3);

    // Only billable hours.
    const totalHoursBillable = getTotalLoggedHours(fakeTimeEntries, fakeProject.id, true);
    expect(totalHoursBillable).toBe(2);

    // Not including billable hours.
    const totalHoursNonBillable = getTotalLoggedHours(fakeTimeEntries, fakeProject.id, false);
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
    const startEnd = getStartEndDates();
    const now = Date.now();
    expect(startEnd.start.date.getTime()).toBeLessThan(now);
    expect(startEnd.end.date.getTime()).toBeGreaterThan(now);
  });

  test('get assigned hours schedule', () => {
    let fakeProjects = [];
    fakeProjects[fakeProject.id] = fakeProject;

    // Get all assigned hours from data.
    const schedule = getAssignedHoursSchedule(
      fakeAssignments,
      fakeStartEnd,
      fakeProjects,
      fakeProject.id
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
      123
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
      false
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
      true
    );
    expect(scheduleBillables[0]).toBe(0);
    expect(scheduleBillables[1]).toBe(0);
    expect(scheduleBillables[2]).toBe(7.2);
    expect(scheduleBillables[3]).toBe(7.2);
    expect(scheduleBillables[4]).toBe(7.2);
    expect(scheduleBillables[5]).toBe(7.2);
    expect(scheduleBillables[6]).toBe(0);
  });

  test('update status', async () => {
    await updateStatus(testSettings);
  });
});

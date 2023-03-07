import { describe, expect, test } from '@jest/globals';
import { ProjectAssignment, TimeEntry } from '../src/types';
import testSettings from './settings';
import { getHarvestUserId, getTimeEntries, getUserProjectAssignments } from '../src/api/harvest';
import { getStartEndDates } from '../src/status';

describe('get harvest data', () => {
  let timeEntries: TimeEntry[] = [];
  let projectAssignments: ProjectAssignment[] = [];

  let userId: number;
  test('get user id', async () => {
    userId = await getHarvestUserId(testSettings);
    expect(userId).toBeGreaterThan(0);
  });

  test('get time entries', async () => {
    timeEntries = await getTimeEntries(testSettings, userId, getStartEndDates());
    // console.log(timeEntries)
    expect(timeEntries.length).toBeGreaterThanOrEqual(0);
  });

  test('time entries data type matches', () => {
    const firstTimeEntry: TimeEntry = timeEntries.pop();
    const emptyTimeEntry: TimeEntry = new TimeEntry();
    for (const prop in emptyTimeEntry) {
      expect(firstTimeEntry.hasOwnProperty(prop)).toBeTruthy();
    }
  });

  test('get project assignments', async () => {
    projectAssignments = await getUserProjectAssignments(testSettings);
    // console.log(projectAssignments)
    expect(projectAssignments.length).toBeGreaterThanOrEqual(0);
  });

  test('project assignments data type matches', () => {
    const firstProjectAssignment: ProjectAssignment = projectAssignments.pop();
    const emptyProjectAssignment: ProjectAssignment = new ProjectAssignment();
    for (const prop in emptyProjectAssignment) {
      expect(firstProjectAssignment.hasOwnProperty(prop)).toBeTruthy();
    }
  });
});

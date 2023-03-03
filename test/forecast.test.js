import { describe, expect, test } from '@jest/globals';
import testSettings from './settings';
import { fakeAssignments, fakeProject } from './test-data';
import {
  getAssignments,
  getForecastUserId,
  getProjects,
} from '../me.reinii.harvest-billables.sdPlugin/api/forecast';
import { getStartEndDates } from '../me.reinii.harvest-billables.sdPlugin/update-status';

describe('get forecast data', () => {
  let userId;
  test('get user id', async () => {
    userId = await getForecastUserId(testSettings);
    expect(userId).toBeGreaterThan(0);
  });

  test('get projects', async () => {
    const projects = await getProjects(testSettings);
    // console.log(projects)
    expect(projects.length).toBeGreaterThanOrEqual(0);

    if (projects.length) {
      const firstProject = projects.pop();
      for (const prop in fakeProject[0]) {
        expect(firstProject.hasOwnProperty(prop)).toBeTruthy();
      }
    }
  });

  test('get assignments', async () => {
    const assignments = await getAssignments(testSettings, userId, getStartEndDates());
    // console.log(assignments)
    expect(assignments.length).toBeGreaterThanOrEqual(0);

    if (assignments.length) {
      const firstAssignment = assignments.pop();
      for (const prop in fakeAssignments[0]) {
        expect(firstAssignment.hasOwnProperty(prop)).toBeTruthy();
      }
    }
  });
});

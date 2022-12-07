import { describe, expect, test } from '@jest/globals'
import { Assignment, Project, StartEndDates } from '../src/types'
import testSettings from './settings'
import { getAssignments, getForecastUserId, getProjects } from '../src/api/forecast'
import { getStartEndDates } from '../src/update-status'

describe('get forecast data', () => {
  let userId: number
  test('get user id', async () => {
    userId = await getForecastUserId(testSettings)
    expect(userId).toBeGreaterThan(0)
  })

  test('get projects', async () => {
    const projects: Project[] = await getProjects(testSettings)
    // console.log(projects)
    expect(projects.length).toBeGreaterThanOrEqual(0)

    if (projects.length) {
      const firstProject: Project = projects.pop()
      const emptyProject: Project = new Project()
      for (const prop in emptyProject) {
        expect(firstProject.hasOwnProperty(prop)).toBeTruthy()
      }
    }
  })

  test('get assignments', async () => {
    const assignments: Assignment[] = await getAssignments(testSettings, userId, getStartEndDates())
    // console.log(assignments)
    expect(assignments.length).toBeGreaterThanOrEqual(0)

    if (assignments.length) {
      const firstAssignment: Assignment = assignments.pop()
      const emptyAssignment: Assignment = new Assignment()
      for (const prop in emptyAssignment) {
        expect(firstAssignment.hasOwnProperty(prop)).toBeTruthy()
      }
    }
  })
})

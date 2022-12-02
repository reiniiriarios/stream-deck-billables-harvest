import { describe, expect, test } from '@jest/globals'
import { Project } from '../src/types'
import testSettings from './settings'
import { getForecastData } from '../src/api/forecast'

describe('get forecast data', () => {
  let projects: Project[] = []

  test('data fetches', async () => {
    projects = await getForecastData(testSettings)
    // console.log(projects)
    expect(projects.length).toBeGreaterThanOrEqual(0)
  })

  if (projects.length) {
    test('data type matches', () => {
      const firstProject: Project = projects.pop()
      const emptyProject: Project = new Project()
      for (const prop in emptyProject) {
        expect(firstProject.hasOwnProperty(prop)).toBeTruthy()
      }
    })
  }
})

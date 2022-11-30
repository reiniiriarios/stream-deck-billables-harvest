// User settings from stream deck button config.
export interface Settings {
  harvestAccountToken: string
  harvestAccountId: string
  forecastAccountId: string
}

// Response from Forecast, with additional properties.
export class Project {
  id: number
  name: string
  harvest_id: number
  color: string
  code: string
  nodes: string
  start_date: string
  end_date: string
  archived: boolean
  updated_at?: string
  updated_by_id?: number
  client_id?: number
  tags?: string[]
  budget_by?: string
  hours?: number
  billable?: boolean
  hours_logged?: number
  hours_schedule?: HoursSchedule
}

export type HoursSchedule = {
  [day: number]: number
}

// Response from Forecast, with additional properties.
export interface RemainingBudgetedHours {
  project_id: number
  budget_by: string
  hours: number
  response_code: number
}

// Response from Harvest, with additional properties.
export class TimeEntry {
  hours: number
  rounded_hours: number
  billable: boolean
  spent_date: string
  notes: string
  created_at: string
  updated_at: string
  user: {
    id: number
    name: string
  }
  client: {
    id: number
    name: string
  }
  project: {
    id: number
    name: string
  }
  task: {
    id: number
    name: string
  }
}

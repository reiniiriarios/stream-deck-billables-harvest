// This data will come from Stream Deck in production.

import path from 'path';
import dotenv from 'dotenv';
import { HourType, Settings, WeekStart } from '../src/types';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const getTestSettings = (): Settings => {
  return {
    harvestAccountToken: process.env.HARVEST_ACCOUNT_TOKEN ?? '',
    harvestAccountId: process.env.HARVEST_ACCOUNT_ID ?? '',
    forecastAccountId: process.env.FORECAST_ACCOUNT_ID ?? '',
    weekStart: WeekStart.Saturday,
    billable: HourType.Both,
  };
};
const testSettings = getTestSettings();

export default testSettings;

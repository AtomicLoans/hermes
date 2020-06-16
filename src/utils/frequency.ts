import { IAlert } from '../database/types';
import { FrequencySettings } from '../jobs/types';
import moment from 'moment';

export function shouldNotify(
  alert: IAlert,
  frequencySettings: FrequencySettings
) {
  if (frequencySettings.once) return false;
  if (
    moment().diff(moment(alert.lastUpdate), 'days') <
    frequencySettings.everyNDays!
  )
    return false;
  return true;
}
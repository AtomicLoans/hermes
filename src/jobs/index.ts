import { defineProcessJob } from './process';
import { defineFetchJob } from './fetch';

import Agenda = require('agenda');
import { defineNotifyJob } from './notify';
import { defineCleanupJob } from './cleanup';

const jobDefiners = [
  defineFetchJob,
  defineProcessJob,
  defineNotifyJob,
  defineCleanupJob,
];

export function defineJobs(agenda: Agenda) {
  jobDefiners.map((definer) => definer(agenda));
}

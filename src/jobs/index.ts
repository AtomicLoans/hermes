import { defineProcessJob } from './process';
import { defineFetchJob } from './fetch';

import Agenda = require('agenda');
import { defineNotifyJob } from './notify';

const jobDefiners = [defineFetchJob, defineProcessJob, defineNotifyJob];

export function defineJobs(agenda: Agenda) {
  jobDefiners.map((definer) => definer(agenda));
}

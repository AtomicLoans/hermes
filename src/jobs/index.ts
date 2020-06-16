import { defineProcessLoanJob } from './loans/process';
import { defineFetchLoansJob } from './loans/fetch';
import { defineNotifyLoanJob } from './loans/notify';
import { defineCheckBalancesJob } from './balance/check';
import { defineNotifyBalanceJob } from './balance/notify';
import { defineCleanupJob } from './cleanup';

import Agenda = require('agenda');

const jobDefiners = [
  defineFetchLoansJob,
  defineProcessLoanJob,
  defineNotifyLoanJob,
  defineCheckBalancesJob,
  defineNotifyBalanceJob,
  defineCleanupJob,
];

export function defineJobs(agenda: Agenda) {
  jobDefiners.map((definer) => definer(agenda));
}

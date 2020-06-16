import Agenda = require('agenda');
import JobType from '../jobs.enums';

import { notifyLowBalance as slackNotifyLowBalance } from '../../services/slack/notify';

export function defineNotifyBalanceJob(agenda: Agenda) {
  console.log('Defining notify balance job...');

  agenda.define(JobType.NotifyBalance, async (job, done) => {
    const {
      data: { name, address, balance },
    } = job.attrs;

    await slackNotifyLowBalance(name, address, balance);
    done();
  });
}

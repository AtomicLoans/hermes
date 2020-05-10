import Agenda = require('agenda');
import JobType from './jobs.enums';
import { LoanModel } from '../database/loans/loans.model';
import { postMessage } from '../services/slack/slack';

export function defineNotifyJob(agenda: Agenda) {
  console.log('Defining notify job...');

  agenda.define(JobType.Notify, async (job, done) => {
    const {
      attrs: { data },
    } = job;
    console.log(`Notifying...`);
    await postMessage(data.text, data.blocks);
    done();
  });
}

import Agenda = require('agenda');
import JobType from './jobs.enums';
import axios from '../utils/http';

export function defineFetchJob(agenda: Agenda) {
  console.log('Defining fetch job...');

  agenda.define(JobType.Fetch, async (job, done) => {
    const { data: loans } = await axios.get('loans');
    console.log('Fetched loans!');

    loans.forEach((loan: any) => {
      agenda.now(JobType.Process, loan);
    });

    done();
  });
}

import Agenda = require('agenda');
import JobType from '../jobs.enums';
import axios from '../../utils/http';

export function defineFetchLoansJob(agenda: Agenda) {
  console.log('Defining fetch loans job...');

  agenda.define(JobType.FetchLoans, async (job, done) => {
    const { data: loans } = await axios.get('loans');
    console.log('Fetched loans!');

    loans.forEach((loan: any) => {
      agenda.now(JobType.ProcessLoan, loan);
    });

    done();
  });
}

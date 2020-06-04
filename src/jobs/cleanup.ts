import JobType from './jobs.enums';
import Agenda from 'agenda';

export function defineCleanupJob(agenda: Agenda) {
  console.log('Defining cleanup job...');

  agenda.define(JobType.Cleanup, async (_job, done) => {
    const numRemoved = await agenda.cancel({ nextRunAt: null });
    console.log(`Cleaned up ${numRemoved} jobs.`);

    done();
  });
}

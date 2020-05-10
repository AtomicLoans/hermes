import { connect } from './database/database';
import Agenda = require('agenda');
import { defineJobs } from './jobs';
import { test } from './services/slack/slack';

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
  console.error('`MONGO_URI` is not defined.');
  process.exit(1);
}

const db = connect(MONGO_URI);
db?.once('open', async () => {
  const agenda = new Agenda({ mongo: db?.collection('agendaJobs').conn.db });

  agenda.on('fail', (err, job) => {
    console.log(err);
  });

  await agenda.start();
  defineJobs(agenda);
});

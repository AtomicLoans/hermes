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

(async () => {
  // The result is cast to the interface
  //   const res = (await web.chat.postMessage({
  //     text: 'This is a test.',
  //     channel,
  //   })) as ChatPostMessageResult;
  //   // Properties of the result are now typed
  //   console.log(
  //     `A message was posed to conversation ${res.channel} with id ${res.ts} which contains the message ${res.message}`
  //   );
  console.log('Hello 🌎!');
  //   test();
})();

import Agenda = require('agenda');
import JobType, { NotifyJobType } from './jobs.enums';
import { Loan } from '../services/atomicloans/loan';
import { TelegramModel } from '../database/telegram/telegram.model';
import AlertTypes from './alerts.enums';
import { EmailModel } from '../database/email/email.model';
import { sendEmail } from '../services/sendgrid';

import TelegramNotify from '../services/telegram/notify';
import SlackNotify from '../services/slack/notify';

export function defineNotifyJob(agenda: Agenda) {
  console.log('Defining notify job...');

  agenda.define(JobType.Notify, async (job, done) => {
    const { data } = job.attrs;

    Object.values(NotifyJobType).forEach((jobType) =>
      agenda.now(jobType, data)
    );

    done();
  });

  agenda.define(JobType.SlackNotify, async (job, done) => {
    const { key, loan } = job.attrs.data as { key: AlertTypes; loan: Loan };

    await SlackNotify(loan, key);
    done();
  });

  agenda.define(JobType.TelegramNotify, async (job, done) => {
    const { key, loan } = job.attrs.data as { key: AlertTypes; loan: Loan };
    const { borrowerPrincipalAddress } = loan;

    const telegrams = await TelegramModel.find({
      address: borrowerPrincipalAddress,
    });

    telegrams.forEach(({ telegramId }) => {
      TelegramNotify(telegramId, loan, key);
    });

    done();
  });

  agenda.define(JobType.EmailNotify, async (job, done) => {
    const { key, loan } = job.attrs.data as { key: AlertTypes; loan: Loan };
    const { borrowerPrincipalAddress } = loan;

    const emailDocuments = await EmailModel.find({
      address: borrowerPrincipalAddress,
    });

    if (emailDocuments.length === 0) return done();
    const emails = emailDocuments.map((doc) => doc.email);

    sendEmail(emails, key, loan);
    done();
  });
}

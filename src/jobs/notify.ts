import Agenda = require('agenda');
import JobType, { LoanNotifyJobType } from './jobs.enums';
import { Loan } from '../services/atomicloans/loan';
import { TelegramModel } from '../database/telegram/telegram.model';
import AlertTypes from './alerts.enums';
import { EmailModel } from '../database/email/email.model';
import { sendEmail } from '../services/sendgrid';

import { notifyLoan as telegramNotifyLoan } from '../services/telegram/notify';
import { notifyLoan as slackNotifyLoan } from '../services/slack/notify';

export function defineNotifyJob(agenda: Agenda) {
  console.log('Defining notify job...');

  agenda.define(JobType.NotifyLoan, async (job, done) => {
    const { data } = job.attrs;

    Object.values(LoanNotifyJobType).forEach((jobType) =>
      agenda.now(jobType, data)
    );

    done();
  });

  agenda.define(JobType.SlackNotifyLoan, async (job, done) => {
    const { key, loan } = job.attrs.data as { key: AlertTypes; loan: Loan };

    await slackNotifyLoan(loan, key);
    done();
  });

  agenda.define(JobType.TelegramNotifyLoan, async (job, done) => {
    const { key, loan } = job.attrs.data as { key: AlertTypes; loan: Loan };
    const { borrowerPrincipalAddress } = loan;

    const telegrams = await TelegramModel.find({
      address: borrowerPrincipalAddress,
    });

    telegrams.forEach(({ telegramId }) => {
      telegramNotifyLoan(telegramId, loan, key);
    });

    done();
  });

  agenda.define(JobType.EmailNotifyLoan, async (job, done) => {
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

import { MailService, MailDataRequired } from '@sendgrid/mail';
import config from 'config';
import { Loan } from '../atomicloans/loan';
import AlertTypes from '../../jobs/alerts.enums';

const sendgridConfig: any = config.get('Sendgrid');
const { SENDGRID_TOKEN } = process.env;

const mailer = new MailService();
mailer.setApiKey(SENDGRID_TOKEN!);

async function send(emails: string[], data: any, templateId: string) {
  const msg: MailDataRequired = {
    to: emails,
    from: {
      email: 'support@atomic.loans',
      name: 'Atomic Loans',
    },
    dynamicTemplateData: {
      ...data,
    },
    asm: {
      groupId: sendgridConfig.unsubscribeId,
    },
    templateId,
  };

  await mailer.send(msg);
}

export async function sendEmail(
  emails: string[],
  alertType: AlertTypes,
  loan: Loan
) {
  console.log('---');
  console.log(emails);
  console.log(alertType);
  console.log(loan.loanId);
  console.log('---');
  await send(emails, loan, sendgridConfig.alerts[alertType].templateId);
}

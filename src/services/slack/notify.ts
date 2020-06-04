import { postMessage } from '.';
import AlertType from '../../jobs/alerts.enums';
import { generateLoanBlocks } from './blocks';
import { Loan } from '../atomicloans/loan';
import { EmailModel } from '../../database/email/email.model';
import { TelegramModel } from '../../database/telegram/telegram.model';
import { getTelegramUsername } from '../telegram';

const messages = {
  [AlertType.NEAR_LIQUIDATION]: 'A loan is near liquidation',
  [AlertType.NEAR_EXPIRY]: 'A loan is about to expire.',
  [AlertType.COLLATERAL_LOCKED]: 'Collateral has been locked.',
};

export default async function notify(loan: Loan, alertType: AlertType) {
  const text = messages[alertType];
  const { borrowerPrincipalAddress: address } = loan;

  const email = (await EmailModel.findOne({ address }))?.email;
  const telegramId = (await TelegramModel.findOne({ address }))?.telegramId;

  const telegram = telegramId
    ? await getTelegramUsername(telegramId)
    : undefined;

  const blocks = generateLoanBlocks(loan, text, email, telegram);
  await postMessage(text, blocks);
}

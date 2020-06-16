import { postMessage } from '.';
import AlertType from '../../jobs/alerts.enums';
import { generateLoanBlocks, generateLowBalanceBlocks } from './blocks';
import { Loan } from '../atomicloans/loan';
import { EmailModel } from '../../database/email/email.model';
import { TelegramModel } from '../../database/telegram/telegram.model';
import { getTelegramUsername } from '../telegram';
import { BN } from 'ethereumjs-util';

type MessageTemplating = {
  [key in AlertType]?: (loan: Loan) => string;
};

const messages: MessageTemplating = {
  [AlertType.NearLiquidation]: () => 'A loan is near liquidation',
  [AlertType.NearExpiry]: () => 'A loan is about to expire.',
  [AlertType.CollateralLocked]: () => 'Collateral has been locked.',
};

export async function notifyLoan(loan: Loan, alertType: AlertType) {
  const template = messages[alertType];
  if (!template) return;

  const text = template(loan);
  const { borrowerPrincipalAddress: address } = loan;

  const email = (await EmailModel.findOne({ address }))?.email;
  const telegramId = (await TelegramModel.findOne({ address }))?.telegramId;

  const telegram = telegramId
    ? await getTelegramUsername(telegramId)
    : undefined;

  const blocks = generateLoanBlocks(loan, text, email, telegram);
  await postMessage(text, blocks);
}

export async function notifyLowBalance(
  name: string,
  address: string,
  balance: number
) {
  const blocks = generateLowBalanceBlocks(name, address, balance);

  await postMessage('Low balance.', blocks);
}

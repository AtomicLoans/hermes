import { Loan } from '../atomicloans/loan';
import AlertType from '../../jobs/alerts.enums';
import moment from 'moment';
import { generateLoanBlocks } from './blocks';
import { sendMessage } from '.';

type MessageTemplating = {
  [key in AlertType]?: (loan: Loan) => string;
};

const messages: MessageTemplating = {
  [AlertType.NearLiquidation]: () =>
    `A loan is at risk of being liquidated. Repay a partial amount to increase collateralization:`,
  [AlertType.NearExpiry]: (loan) =>
    `A loan is about to expire ${moment(
      loan.loanExpiration * 1000
    ).fromNow()}:`,
  [AlertType.CollateralLocked]: (loan) =>
    `Your Bitcoin collateral deposit has been confirmed and you may now withdraw *${
      loan.principalAmount
    } ${loan.principal.toUpperCase()}* from the loan.`,
};

export async function notifyLoan(
  telegramId: number,
  loan: Loan,
  alertType: AlertType
) {
  const template = messages[alertType];
  if (!template) return;

  const message = generateLoanBlocks(loan, template(loan));
  sendMessage(telegramId, message);
}

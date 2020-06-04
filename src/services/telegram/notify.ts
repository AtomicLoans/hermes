import { Loan } from '../atomicloans/loan';
import AlertType from '../../jobs/alerts.enums';
import moment from 'moment';
import { generateLoanBlocks } from './blocks';
import { sendMessage } from '.';

type MessageTemplating = {
  [key in AlertType]: (loan: Loan) => string;
};

const messages: MessageTemplating = {
  [AlertType.NEAR_LIQUIDATION]: () =>
    `A loan is at risk of being liquidated. Repay a partial amount to increase collateralization:`,
  [AlertType.NEAR_EXPIRY]: (loan) =>
    `A loan is about to expire ${moment(
      loan.loanExpiration * 1000
    ).fromNow()}:`,
  [AlertType.COLLATERAL_LOCKED]: (loan) =>
    `Your Bitcoin collateral deposit has been confirmed and you may now withdraw *${
      loan.principalAmount
    } ${loan.principal.toUpperCase()}* from the loan.`,
};

export default async function notify(
  telegramId: number,
  loan: Loan,
  alertType: AlertType
) {
  const message = generateLoanBlocks(loan, messages[alertType](loan));
  sendMessage(telegramId, message);
}

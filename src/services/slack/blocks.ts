import moment from 'moment-timezone';
import { formatValue } from '../../utils/currency';

export function generateLoanBlocks(
  text: string,
  loanId: number,
  principal: string,
  expiration: number,
  amount: number,
  collateralizationRatio: number,
  liquidationPrice: number,
  borrower: string
) {
  const expirationString = moment
    .unix(expiration)
    .tz('America/Toronto')
    .format('LLLL z');

  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Loan Id:*\n${principal.toUpperCase()} #${loanId}`,
        },
        {
          type: 'mrkdwn',
          text: `*Expiration:*\n${expirationString}`,
        },
        {
          type: 'mrkdwn',
          text: `*Amount:*\n${formatValue(amount)} ${principal.toUpperCase()}`,
        },
        {
          type: 'mrkdwn',
          text: `*Collateralization Ratio:*\n${collateralizationRatio}%`,
        },
        {
          type: 'mrkdwn',
          text: `*Liquidation Price:*\n$${formatValue(liquidationPrice)}`,
        },
        {
          type: 'mrkdwn',
          text: `*Borrower:*\n<https://etherscan.io/address/${borrower}|${borrower}>`,
        },
      ],
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: 'View Loan',
          },
          url: `https://atomic.loans/app/borrow/${principal.toUpperCase()}/${loanId}`,
        },
      ],
    },
  ];
}

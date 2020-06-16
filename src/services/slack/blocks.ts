import moment from 'moment-timezone';
import { formatValue } from '../../utils/currency';
import { Loan } from '../atomicloans/loan';
import telegram from '../telegram';
import { BN } from 'ethereumjs-util';

export function generateLoanBlocks(
  loan: Loan,
  text: string = '',
  email?: string,
  telegram?: string
) {
  const {
    loanId,
    principal,
    loanExpiration,
    principalAmount,
    collateralizationRatio,
    liquidationPrice,
    borrowerPrincipalAddress,
  } = loan;

  const expirationString = moment
    .unix(loanExpiration)
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
          text: `*Amount:*\n${formatValue(
            principalAmount
          )} ${principal.toUpperCase()}`,
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
          text: `*Borrower:*\n<https://etherscan.io/address/${borrowerPrincipalAddress}|${borrowerPrincipalAddress}>`,
        },
        {
          type: 'mrkdwn',
          text: `*Email:*\n${email || 'N/A'}`,
        },
        {
          type: 'mrkdwn',
          text: `*Telegram*:\n${telegram ? `https://t.me/${telegram}` : 'N/A'}`,
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

export function generateLowBalanceBlocks(
  name: string,
  address: string,
  balance: number
) {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ':alert: Low Ether Balance! :alert:',
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Name:*\n${name}`,
        },
        {
          type: 'mrkdwn',
          text: `*Balance:*\n${balance} ETH`,
        },
        {
          type: 'mrkdwn',
          text: `*Address:*\n<https://etherscan.io/address/${address}|${address}>`,
        },
      ],
    },
  ];
}

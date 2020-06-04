import moment from 'moment-timezone';
import { formatValue } from '../../utils/currency';
import { Loan } from '../atomicloans/loan';

export function generateLoanBlocks(loan: Loan, text = '') {
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

  return `
${text}

*Loan ID:*\n${principal.toUpperCase()} #${loanId}
*Expiration:*\n${expirationString}
*Amount:*\n${formatValue(principalAmount)} ${principal.toUpperCase()}
*Collateralization Ratio:*\n${collateralizationRatio}%
*Liquidation Price:*\n$${formatValue(liquidationPrice)}
*Borrower:*\n[${borrowerPrincipalAddress}](https://etherscan.io/address/${borrowerPrincipalAddress})
  `;
}

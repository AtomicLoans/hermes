import BN from 'bignumber.js';
import { getMedianBtcPrice, getBTCPrice } from './prices';
import { Loan, RawLoan } from '../services/atomicloans/loan';
import moment from 'moment';

export function getLiquidationValues(loan: RawLoan) {
  const { minimumCollateralAmount, collateralAmount } = loan;
  const rate = getBTCPrice();

  const liquidationPrice = new BN(minimumCollateralAmount)
    .dividedBy(collateralAmount)
    .times(rate);

  const collateralizationRatio = new BN(rate).dividedBy(
    liquidationPrice.dividedBy(140)
  );

  return {
    liquidationPrice: parseFloat(liquidationPrice.toFixed(2)),
    collateralizationRatio: parseFloat(collateralizationRatio.toFixed(0)),
  };
}

export function buildLoan(rawLoan: RawLoan): Loan {
  const liquidationValues = getLiquidationValues(rawLoan);
  const expires = moment(rawLoan.loanExpiration * 1000).fromNow();

  return { ...rawLoan, ...liquidationValues, expires };
}

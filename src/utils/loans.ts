import BN from 'bignumber.js';
import { getMedianBtcPrice } from './prices';

export function getLiquidationValues(
  minimumCollateralAmount: number,
  collateralAmount: number,
  rate: number
) {
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

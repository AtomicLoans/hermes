export const enum Status {
  Accepted = 'ACCEPTED',
  Withdrawn = 'WITHDRAWN',
  Cancelled = 'CANCELLED',
  Liquidated = 'LIQUIDATED',
  AwaitingCollateral = 'AWAITING_COLLATERAL',
  Approved = 'APPROVED',
}

interface RawLoan {
  minimumCollateralAmount: number;
  loanExpiration: number;
  lenderPrincipalAddress: string;
  collateralAmount: number;
  loanId: number;
  status: Status;
  requestLoanDuration: string;
  principal: string;
  collateral: string;
  borrowerPrincipalAddress: string;
  principalAmount: number;
}

interface Loan extends RawLoan {
  collateralizationRatio: number;
  liquidationPrice: number;
  expires: string;
}

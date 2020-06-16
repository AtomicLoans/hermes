enum LoanAlertType {
  NearExpiry = 'NEAR_EXPIRY',
  NearLiquidation = 'NEAR_LIQUIDATION',
  CollateralLocked = 'COLLATERAL_LOCKED',
}

enum GeneralAlertType {
  AddressLowBalance = 'ADDRESS_LOW_BALANCE',
}

type AlertType = GeneralAlertType | LoanAlertType;
const AlertType = { ...GeneralAlertType, ...LoanAlertType };

export { GeneralAlertType, LoanAlertType };
export default AlertType;

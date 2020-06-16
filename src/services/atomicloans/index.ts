import axios from '../../utils/http';
import { buildLoan } from '../../utils/loans';
import { Status, Loan, RawLoan } from './loan';

const INACTIVE_STATES = [Status.Cancelled, Status.Liquidated, Status.Accepted];

export async function getLoans(): Promise<RawLoan[]> {
  const { data } = await axios.get('loans');
  return data;
}

export async function getLoansFor(
  borrowerAddress: string,
  active?: boolean
): Promise<Loan[]> {
  const loans = await getLoans();
  const borrowerLoans = loans
    .filter(
      (loan) =>
        loan.borrowerPrincipalAddress === borrowerAddress &&
        (active ? INACTIVE_STATES.indexOf(loan.status) === -1 : true)
    )
    .map(buildLoan);

  return borrowerLoans;
}

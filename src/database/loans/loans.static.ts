import { ILoanModal } from './loans.types';

export async function findOneOrCreate(
  this: ILoanModal,
  loanId: number,
  principal: string
) {
  const record = await this.findOne({ loanId, principal });
  if (record) return record;
  return this.create({ loanId, principal });
}

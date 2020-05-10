import { Document, Model, Types } from 'mongoose';

interface IAlert {
  key: string;
  lastUpdate: Date;
}

export interface ILoan {
  loanId: number;
  principal: string;
  alerts: Types.Array<IAlert>;
}

export interface ILoanDocument extends ILoan, Document {}
export interface ILoanModal extends Model<ILoanDocument> {
  findOneOrCreate: (
    loanId: number,
    principal: string
  ) => Promise<ILoanDocument>;
}

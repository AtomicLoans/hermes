import { Document, Model, Types } from 'mongoose';
import { IAlert } from '../types';

export interface ILoan {
  loanId: number;
  principal: string;
  alerts: Types.Array<IAlert>;
}

export interface ILoanDocument extends ILoan, Document {}
export interface ILoanModel extends Model<ILoanDocument> {
  findOneOrCreate: (
    loanId: number,
    principal: string
  ) => Promise<ILoanDocument>;
}

import { model } from 'mongoose';
import { ILoanDocument, ILoanModal } from './loans.types';
import LoanSchema from './loans.schema';

export const LoanModel = model<ILoanDocument>('loan', LoanSchema) as ILoanModal;

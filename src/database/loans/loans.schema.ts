import { Schema } from 'mongoose';
import { findOneOrCreate } from './loans.static';

const LoanSchema = new Schema({
  loanId: Number,
  principal: String,
  alerts: [{ key: String, lastUpdated: { type: Date, default: Date.now } }],
});

LoanSchema.index({ loanId: 1, principal: 1 }, { unique: true });

LoanSchema.statics.findOneOrCreate = findOneOrCreate;

export default LoanSchema;

import { Schema } from 'mongoose';
import { findOneOrCreate } from './address.static';

const AddressSchema = new Schema({
  address: {
    type: String,
    index: true,
  },
  alerts: [{ key: String, lastUpdated: { type: Date, default: Date.now } }],
});

AddressSchema.statics.findOneOrCreate = findOneOrCreate;

export default AddressSchema;

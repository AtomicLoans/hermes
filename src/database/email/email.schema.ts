import { Schema } from 'mongoose';

const EmailSchema = new Schema({
  email: {
    type: String,
    index: true,
    unique: true,
  },
  address: {
    type: String,
    index: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
});

export default EmailSchema;

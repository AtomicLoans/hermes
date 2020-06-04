import { Schema } from 'mongoose';

const TelegramSchema = new Schema({
  telegramId: {
    type: Number,
    index: true,
    unique: true,
  },
  address: {
    type: String,
    index: true,
  },
});

export default TelegramSchema;

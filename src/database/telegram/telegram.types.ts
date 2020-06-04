import { Document, Model } from 'mongoose';

export interface ITelegram {
  telegramId: number;
  address: string;
}

export interface ITelegramDocument extends ITelegram, Document {}
export interface ITelegramModal extends Model<ITelegramDocument> {}

import { model } from 'mongoose';
import { ITelegramDocument, ITelegramModel } from './telegram.types';
import TelegramSchema from './telegram.schema';

export const TelegramModel = model<ITelegramDocument>(
  'telegram',
  TelegramSchema
) as ITelegramModel;

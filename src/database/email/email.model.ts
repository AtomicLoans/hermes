import { model } from 'mongoose';
import { IEmailDocument, IEmailModel } from './email.types';
import EmailSchema from './email.schema';

export const EmailModel = model<IEmailDocument>(
  'email',
  EmailSchema
) as IEmailModel;

import { model } from 'mongoose';
import { IEmailDocument, IEmailModal } from './email.types';
import EmailSchema from './email.schema';

export const EmailModel = model<IEmailDocument>(
  'email',
  EmailSchema
) as IEmailModal;

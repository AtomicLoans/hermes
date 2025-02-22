import { Document, Model } from 'mongoose';

export interface IEmail {
  email: string;
  address: string;
  enabled: boolean;
}

export interface IEmailDocument extends IEmail, Document {}
export interface IEmailModel extends Model<IEmailDocument> {}

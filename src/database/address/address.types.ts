import { Document, Model, Types } from 'mongoose';
import { IAlert } from '../types';

export interface IAddress {
  address: string;
  alerts: Types.Array<IAlert>;
}

export interface IAddressDocument extends IAddress, Document {}
export interface IAddressModel extends Model<IAddressDocument> {
  findOneOrCreate: (address: string) => Promise<IAddressDocument>;
}

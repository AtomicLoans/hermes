import { model } from 'mongoose';
import { IAddressDocument, IAddressModel } from './address.types';
import AddressSchema from './address.schema';

export const AddressModel = model<IAddressDocument>(
  'address',
  AddressSchema
) as IAddressModel;

import { IAddressModel } from './address.types';

export async function findOneOrCreate(this: IAddressModel, address: string) {
  const record = await this.findOne({ address });
  if (record) return record;
  return this.create({ address });
}

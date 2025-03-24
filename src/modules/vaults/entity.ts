import type { IVaultEntity } from './interface'

export type TypeFieldDate = 'created_at' | 'updated_at'

export const collectionName = 'vaults'

export class VaultEntity {
  constructor(public data: IVaultEntity) {}

  public generateDate(field: TypeFieldDate) {
    this.data[field] = new Date()
  }
}

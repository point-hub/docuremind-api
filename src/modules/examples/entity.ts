import { type IExampleEntity } from './interface'

export const collectionName = 'examples'

export type TypeFieldDate = 'created_at' | 'updated_at'

export class ExampleEntity {
  constructor(public data: IExampleEntity) {}

  public generateDate(field: TypeFieldDate) {
    this.data[field] = new Date()
  }
}

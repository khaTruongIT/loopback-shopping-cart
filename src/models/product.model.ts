import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Category} from './category.model';

@model(
//   {
//   settings: {
//     foreignKeys: {
//       fk_category_id: {
//         name: 'fk_category_id',
//         entity: 'Category',
//         entityKey: 'id',
//         foreignKey: 'categoryId'
//       }
//     }
//   }
// }
)
export class Product extends Entity {

  @property({
    type:'string',
    id: true,
  })
  id : string;

  @property({
    type:'string',
    required: true,
  })
  name: string;

  @property({
    type:'string',
    required: true
  })
  description: string;

  @property({
    type:'string',
    required:true,
  })
  imageUrl: string;

  @property({
    type: 'number',
    required: true
  })
  quantity: number;

  @property({
    type: 'number',
    required: true
  })
  sold: number;

  @property({
   required: false,
    type:'boolean'
  })
  shipping: number;

  @belongsTo(() => Category)
  categoryId: string;

  @property({
    type: 'number'
  })
  price: number

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;

import {Entity, model, property, hasMany, hasOne} from '@loopback/repository';
import {Order} from './order.model';
import {Cart} from './cart.model';


@model()
export class User extends Entity {

  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @property({
    type: 'srtring',
    required: true
  })
  password: string;
  
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  firstName?: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property({
    type: 'array',
    itemType: 'string'
  })
  roles?: string[];

  @property({
    type: 'string',
  })
  resetTimestamp: string;

  @property({
    type: 'string',
  })
  resetKeyTimestamp: string;

  @hasMany(() => Order)
  orders: Order[];

  @hasOne(() => Cart)
  cart: Cart;
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;

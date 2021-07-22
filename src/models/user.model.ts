import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Cart} from './cart.model';
import {Order} from './order.model';
import {UserCredentials} from './user-credentials.model';

@model({
  settings: {
    postgresql: {
      schema: 'public', table: 'user'
    }
  }
})
export class User extends Entity {

  @property({
    type: 'number',
    id: true,
      postgresql: {
        columnName: 'id',
        dataType: 'integer'
      }
  })
  id: number;

  @property({
    type: 'string',
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
    type: 'Date',
    postgresql: {
      column: 'createdAt',
      type: 'timestamp with time zone'
    }
  })
  createdAt: Date;

  @hasMany(() => Order)
  orders: Order[];

  @hasOne(() => Cart)
  cart: Cart;

  @hasOne(() => UserCredentials, {keyTo: 'userId'})
  userCredentials: UserCredentials;
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;

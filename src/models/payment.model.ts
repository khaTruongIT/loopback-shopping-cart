import {Entity, model, property, belongsTo} from '@loopback/repository';

import {User} from './user.model';
import {Order} from './order.model';

@model({
  settings: {
    foreignKeys: {
      fk_payment_userId: {
        name: 'fk_payment_userId',
        entity: 'User',
        entityKey: 'id',
        foreignKey: 'userId',
      },
      fk_order_orderId: {
        name: 'fk_order_orderId',
        entity: 'Order',
        entityKey: 'id',
        foreignKey: 'orderId'
      }
    }
  }
})
export class Payment extends Entity {
  @property() stripeId: string;

  @property({
    type: 'string'
  })
  orderId: string;

  @property({
    type: 'number'
  })
  userId: number;

  @belongsTo(() => User)
  user: User

  constructor(data?: Partial<Payment>) {
    super(data);
  }
}

export interface PaymentRelations {
  // describe navigational properties here
}

export type PaymentWithRelations = Payment & PaymentRelations;

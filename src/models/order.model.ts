import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import { CartItem } from './cart-item.model';

export enum OrderStatus {
  Completed = 'completed',
  AwaitingPayment = 'awaiting-payment',
  Cancelled = 'cancelled',
  Created = 'created'
}
@model()
export class Order extends Entity {
  @property({
    id: true,
    type: 'string',
  })
  id: string;

  @property({
    default: OrderStatus.Created
  })
  status: string;

  @property() total: number;

  @property({
    type: 'date'
  })
  date?: string;

  @belongsTo(() => User)
  userId: string;

  @property.array(CartItem, {
    required: true
  })
  products: CartItem[];

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  // describe navigational properties here
}

export type OrderWithRelations = Order & OrderRelations;

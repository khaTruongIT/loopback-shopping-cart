import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';
import {CartItem} from './cart-item.model';

@model({

})
export class Cart extends Entity {

  @belongsTo(() => User)
  userId: string;

  @property.array(CartItem)
  items?: CartItem[];

  constructor(data?: Partial<Cart>) {
    super(data);
  }
}

export interface CartRelations {
  // describe navigational properties here
}

export type CartWithRelations = Cart & CartRelations;

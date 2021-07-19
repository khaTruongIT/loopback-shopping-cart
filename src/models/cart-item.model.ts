import {Entity, model, property} from '@loopback/repository';

@model()
export class CartItem extends Entity {

  @property({id: true})
  productId: number;

  @property()
  name: string;

  @property()
  quantity: number;

  @property()
  price?: number;

  constructor(data?: Partial<CartItem>) {
    super(data);
  }
}

export interface CartItemRelations {
  // describe navigational properties here
}

export type CartItemWithRelations = CartItem & CartItemRelations;

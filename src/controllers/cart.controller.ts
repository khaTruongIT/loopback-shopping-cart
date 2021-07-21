// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';

import {
  put,
  get,
  del,
  param,
  requestBody,
  HttpErrors,
  post
} from '@loopback/rest';


import { authorize } from '@loopback/authorization';
import { authenticate } from '@loopback/authentication';
import {UserProfile, SecurityBindings} from '@loopback/security';
import {inject} from '@loopback/core';
import { repository } from '@loopback/repository';
import { CartRepository } from '../repositories';
import {Cart, CartItem} from '../models';
import { basicAuthorization } from '../services/authorization';
import { OPERATION_SECURITY_SPEC } from '../utlis';
import {UserProfileSchema} from '../utlis/schema';


export class CartController {
  constructor(
    @inject(SecurityBindings.USER) public currentUserProfile: UserProfile,
    @repository(CartRepository) public cartRepository: CartRepository,
  ) {}

  //tạo cart
  @post('/carts/{userId}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'User shopping cart is created or updated',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async create(
    @param.path.string('userId') userId: string,
    @requestBody({description: 'shopping cart'}) cart: Cart,
  ): Promise<void> {
    await this.cartRepository.set(userId, cart);
  }

  //xóa cart
  @del('/carts/{userId}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204' :  {
        description: 'Cart delete success',
      }
    }
  })
  @authenticate("jwt")
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async deleteById(@param.path.string('userId') userId: string): Promise<void> {
    await this.cartRepository.delete(userId)
  }

  //Người dùng lấy thông tin cart
  @get('/carts/{userId}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200' : {
        description: 'Read user cart',
        content: {
          'application/json': {schema: {
            'x-ts-type': Cart
          }}
        }
      }
    }
  })
  @authenticate("jwt")
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async getCart(@param.path.string('userId') userId: string): Promise<Cart>
  {
    const cart = await this.cartRepository.get(userId);
    if(cart == null) {
      throw new HttpErrors.NotFound(
        'Shopping cart not found'
      )
    }
    return cart;
  }

  //thêm cart item vào cart
  @post('/shoppingCarts/{userId}/items', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User shopping cart item is created',
        content: {
          'application/json': {schema: {'x-ts-type': Cart}},
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async addItem(
    @param.path.number('userId') userId: number,
    @requestBody({description: 'cart item'}) item: CartItem,
  ): Promise<Cart> {
    return this.cartRepository.addItem(userId, item);
  }

  //người dùng cập nhật cart
  @put('/carts/{userId}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: "update cart"
      }
    }
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async setCart(
    @param.path.string('userId') userId: string,
    @requestBody({description: 'cart'}) cart: Cart
  ): Promise<void> {
    await this.cartRepository.set(userId, cart);
  }

  // @put('/orders/{orderId}/status/{userId}', {
  //   respones: {
  //     '204': {
  //       description: 'Update Order Status'
  //     }
  //   }
  // })


}


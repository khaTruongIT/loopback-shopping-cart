
import { authenticate } from '@loopback/authentication'
import { authorize } from '@loopback/authorization'
import {del, get, post, param, patch, requestBody, HttpErrors, put, getModelSchemaRef} from '@loopback/rest';
import { OrderRepository, UserRepository } from '../repositories';
import { basicAuthorization } from '../services/authorization';
import { OPERATION_SECURITY_SPEC } from '../utlis';
import {CountSchema, repository} from '@loopback/repository';
import {stringify} from 'querystring';
import {Order} from '../models';
import {filter} from 'lodash';
import {UserServiceBindings} from '@loopback/authentication-jwt';


export class OrderController  {
  constructor(
    @repository(UserRepository) protected userReposiroty: UserRepository,
    @repository(OrderRepository) protected orderRepository: OrderRepository
  ) {}

  //tạo order
  @post('/order/create/{userId}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200' : {
        description: 'tạo order',
        content: {
          'application/json': {schema: {'x-ts-type': Order},}
        }
      }
    }
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async createOrder(
    @param.path.number('userId') userId: number,
    @requestBody() order: Order
  ): Promise<Order> {
    order.date = new Date().toString();
    return this.userReposiroty
      .orders(userId)
      .create(order)
      .catch(error => {
        throw HttpErrors(400);
      });
  }

  //Admin lấy thông tin các order
  @get('/order/list/{userId}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Những order của người dùng',
        content: {
          'application/json' : {
            schema: {type: 'array', items: {'x-ts-type': Order}}
          }
        }
      }
    }
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  async listOrders(
    @param.path.number('userId') userId: number,
  ): Promise<Order[]> {
    const orders = await this.orderRepository.find(
     {
        limit: 100
      }
    )
    return orders;
  };
  //Update thông tin order
  @put('/order/{orderId}/{userId}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200' : {
        description: 'Get and update order status value',
      }
    }
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin'], voters:[basicAuthorization]})
  async updateOrder(
    @param.path.number('orderId') orderId: number,
    @requestBody({
      'application/json': {
        schema: getModelSchemaRef(Order, {partial: true})
      }
    }) order : Order
  ) : Promise<void> {
    await this.orderRepository.updateById(orderId, order);
  }

}



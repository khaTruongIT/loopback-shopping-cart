import {inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, Order} from '../models';
import {OrderRepository} from './order.repository';

export type Credentials = {
  email: string,
  password: string
}

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {

  public orders: HasManyRepositoryFactory<Order, typeof User.prototype.id>

  constructor(
    @repository(OrderRepository) protected orderRepository: OrderRepository,
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(User, dataSource);
    this.orders = this.createHasManyRepositoryFactoryFor(
      'orders',
      async () => orderRepository,
    );


  }



}

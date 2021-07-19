import {inject} from '@loopback/core';
import {DefaultKeyValueRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Cart, CartItem} from '../models';
import {promisify} from 'util';
import {retry, Task} from '../utlis/retry';


export class CartRepository extends DefaultKeyValueRepository<Cart> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Cart, dataSource);
  }

  addItem(userId: string, item: CartItem) {
    const task: Task<Cart> = {
      run: async () => {
        const addItemToCart = (cart: Cart | null) => {
          cart = cart ?? new Cart({userId});
          cart.items = cart.items ?? [];
          cart.items.push(item);
          return cart;
        };
        const result = await this.checkAndSet(userId, addItemToCart);
        return {
          done: result != null,
          value: result,
        };
      },
      description: `update the shopping cart for '${userId}'`,
    };
    return retry(task, {maxTries: 10, interval: 10});
  }


  async checkAndSet(
    userId: string,
    check: (current: Cart | null) => Cart | null,
  ) {
    const connector = this.kvModelClass.dataSource!.connector!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const execute = promisify((cmd: string, args: any[], cb: Function) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      connector.execute!(cmd, args, cb);
    });
    /**
     * - WATCH userId
     * - GET userId
     * - check(cart)
     * - MULTI
     * - SET userId
     * - EXEC
     */
    await execute('WATCH', [userId]);
    let cart: Cart | null = await this.get(userId);
    cart = check(cart);
    if (!cart) return null;
    await execute('MULTI', []);
    await this.set(userId, cart);
    const result = await execute('EXEC', []);
    return result == null ? null : cart;
  }
}

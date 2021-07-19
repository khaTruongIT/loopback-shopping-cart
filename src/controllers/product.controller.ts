// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';

import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody, getWhereSchemaFor,
} from '@loopback/rest';

import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {Product} from '../models';
import {ProductRepository} from '../repositories';
import {basicAuthorization} from '../services/authorization';
import {OPERATION_SECURITY_SPEC} from '../utlis';


export class ProductController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) {}

      /// xem sản phẩm
    @get(`/products/{id}`, {
      responses: {
        '200': {
          description: 'Product model instance',
          content: {
            'application/json': {
              schema: getModelSchemaRef(Product, {includeRelations: true}),
            },
          },
        },
      },
    })
    async findById(
      @param.path.string('id') id: string,
      @param.query.object('filter', getFilterSchemaFor(Product))
      filter?: Filter<Product>,
    ): Promise<Product> {
      return this.productRepository.findById(id,filter);
    }

    //update sản phẩm
    @patch('/products/{id}', {
      responses: {
        '204': {
          description: 'Product PATCH success',
        },
      },
    })
    @authenticate('jwt')
    async updateById(
      @param.path.string('id') id: string,
      @requestBody() product: Product,
      ): Promise<void> {
      await this.productRepository.updateById(id, product);
    }

    @put('/products/{id}', {
      responses: {
        '204': {
          description: 'Product PUT success',
        },
      },
    })
    async replaceById(
      @param.path.string('id') id: string,
      @requestBody() product: Product,
    ): Promise<void> {
      await this.productRepository.replaceById(id, product);
    }

    // tạo sản phẩm
  @post('/products', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Product model instance',
        content: {'application/json': {schema: getModelSchemaRef(Product)}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProduct',
            exclude: ['id'],
          }),
        },
      },
    })
      product: Omit<Product, 'id'>,
  ): Promise<Product> {
    return this.productRepository.create(product);
  }

    //dem so luong san pham
  @get('/products/count', {
    responses: {
      '200': {
        description: 'Product model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Product))
      where?: Where<Product>,
  ): Promise<Count> {
    return this.productRepository.count(where);
  }

  //xem sản phẩm 
  @get('/products', {
    responses: {
      '200': {
        description: 'Array of Product model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Product, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Product))
      filter?: Filter<Product>,
  ): Promise<Product[]> {
    return this.productRepository.find(filter);
  }

  @patch('/products', {
    responses: {
      '200': {
        description: 'Product PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody() product: Product,
    @param.query.object('where', getWhereSchemaFor(Product))
      where?: Where<Product>,
  ): Promise<Count> {
    return await this.productRepository.updateAll(product, where);
  }

  //XÓA SẢN PHẨM
  @del(`/products/{id}`, {
    responses: {
      '204' : {
        description: 'Xóa sản phẩm thành công',
      },
    }
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.productRepository.deleteById((id));
  }
}

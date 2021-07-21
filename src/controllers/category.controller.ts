import {Filter, repository} from '@loopback/repository';
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
import {Category} from '../models';
import {CategoryRepository} from '../repositories';
import {basicAuthorization} from '../services/authorization';
import {OPERATION_SECURITY_SPEC} from '../utlis';
import { authorize } from '@loopback/authorization';
import { authenticate } from '@loopback/authentication';

export class CategoryController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
  ) {}

  //lấy danh mục
  @get('/categories', {
    responses: {
      '200': {
        description: 'Array of Category model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Category}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Category))
    filter?: Filter<Category>,
  ): Promise<Category[]> {
    return await this.categoryRepository.find(filter);
  }

      // tạo danh mục
      @post('/categories', {
        security: OPERATION_SECURITY_SPEC,
        responses: {
          '200': {
            description: 'Category model instance',
            content: {'application/json': {schema: getModelSchemaRef(Category)}},
          },
        },
      })
      @authenticate('jwt')
      @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
      async create(
        @requestBody({
          content: {
            'application/json': {
              schema: getModelSchemaRef(Category, {
                title: 'NewCategory',
                exclude: ['id'],
              }),
            },
          },
        })
          category: Omit<Category, 'id'>,
      ): Promise<Category> {
        return this.categoryRepository.create(category);
      }

      //truy cập danh mục
      @get('/categories/{id}', {
        responses: {
          '200': {
            description: 'Category model instance',
            content: {
              'application/json' : {
                schema: getModelSchemaRef(Category, {includeRelations: true })
              }
            }
          }
        }
      })
      async findById(@param.path.string('id') id: string): Promise<Category> {
        return await this.categoryRepository.findById(id);
      }

      //xóa category
      @del('/categories/{id}', {
        responses: {
          '204': {
            description: 'Xóa danh mục sản phẩm thành công',
          }
        }
      })
      async deleteById(@param.path.string('id') id: string) : Promise<void> {
        await this.categoryRepository.deleteById(id);
      }
}

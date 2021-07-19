import {Filter, repository} from '@loopback/repository';
import {param, get, getFilterSchemaFor} from '@loopback/rest';
import {Category} from '../models';
import {CategoryRepository} from '../repositories';

export class CategoryController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
  ) {}

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
}

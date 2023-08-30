import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminGetCategoryRequest } from '../category-admin-api/category-admin.view';
import { paginate } from '../pagination/helper';
import { PaginatedList } from '../pagination/types';
import { CategoryDto, CreateCategoryParams, UpdateCategoryParams } from './category.dto';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>
  ) {}

  getCategoryRepository(): Repository<Category> {
    return this.categoryRepo;
  }

  public async getAll(request: AdminGetCategoryRequest): Promise<PaginatedList<CategoryDto>> {
    const query = this.categoryRepo.createQueryBuilder('c');
    if (request.name) {
      query.andWhere('c.name LIKE :name', { name: `%${request.name}%` });
    }
    return await paginate(query, {
      current: request.current,
      pageSize: request.pageSize
    });
  }

  public async getById(id: string): Promise<CategoryDto> {
    return this.categoryRepo.findOne({ where: { id } });
  }

  public async createCategory(params: CreateCategoryParams): Promise<Category> {
    const category = this.categoryRepo.create();
    category.name = params.name;

    await this.categoryRepo.save(category, { reload: true });

    return category;
  }

  public async updateCategory(id: string, params: UpdateCategoryParams): Promise<Category> {
    const category = await this.categoryRepo.findOneOrFail({
      where: {
        id
      }
    });
    if (!category) {
      throw new NotAcceptableException('Category not found');
    }

    category.name = params.name;

    await this.categoryRepo.save(category);
    return category;
  }
}

import { Module } from '@nestjs/common';
import { CategoryModule } from '../category/category.module';
import { AdminCategoryController } from './category-admin.controller';

@Module({
  imports: [CategoryModule],
  controllers: [AdminCategoryController]
})
export class CategoryAdminApiModule {}

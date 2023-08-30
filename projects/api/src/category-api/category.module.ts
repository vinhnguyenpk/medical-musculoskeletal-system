import { Module } from '@nestjs/common';
import { CategoryModule } from '../category/category.module';
import { CategoryController } from './category.controller';

@Module({
  imports: [CategoryModule],
  controllers: [CategoryController]
})
export class CategoryApiModule {}

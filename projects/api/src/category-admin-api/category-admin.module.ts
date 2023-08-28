import { Module } from "@nestjs/common";
import { AdminCategoryController } from "./category-admin.controller";
import { CategoryModule } from "../category/category.module";

@Module({
  imports: [CategoryModule],
  controllers: [AdminCategoryController],
})
export class CategoryAdminApiModule {}

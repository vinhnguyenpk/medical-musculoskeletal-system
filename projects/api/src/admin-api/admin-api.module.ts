import { CoreModule } from "@/core/core.module";
import { AdminMusculoskeletalController } from "@/musculoskeletal-admin-api/musculoskeletal-admin.controller";
import { MusculoskeletalAdminApiModule } from "@/musculoskeletal-admin-api/musculoskeletal-admin.module";
import { MusculoskeletalModule } from "@/musculoskeletal/musculoskeletal.module";
import { LoggerMiddleware } from "@medical-musculoskeletal/logger";
import { Global, MiddlewareConsumer, Module } from "@nestjs/common";
import { AdminApiController } from "./admin-api.controller";
import { CategoryAdminApiModule } from "@/category-admin-api/category-admin.module";
import { PostAdminApiModule } from "@/posts-admin-api/post-admin.module";
import { AdminCategoryController } from "@/category-admin-api/category-admin.controller";
import { AdminPostController } from "@/posts-admin-api/post-admin.controller";
import { CategoryModule } from "@/category/category.module";
import { PostModule } from "@/posts/post.module";

@Global()
@Module({
  imports: [
    CoreModule,
    MusculoskeletalAdminApiModule,
    MusculoskeletalModule,
    CategoryAdminApiModule,
    PostAdminApiModule,
    CategoryModule,
    PostModule,
  ],
  controllers: [
    AdminApiController,
    AdminMusculoskeletalController,
    AdminCategoryController,
    AdminPostController,
  ],
  providers: [
    // {
    //   provide: APP_FILTER,
    //   useClass: AdminAPIExceptionFilter,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: AdminAuthGuard,
    // },
  ],
})
export class AdminAPIModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("/");
  }
}

import { CoreModule } from "@/core/core.module";
import { AdminMusculoskeletalController } from "@/musculoskeletal-admin-api/musculoskeletal-admin.controller";
import { MusculoskeletalAdminApiModule } from "@/musculoskeletal-admin-api/musculoskeletal-admin.module";
import { MusculoskeletalModule } from "@/musculoskeletal/musculoskeletal.module";
import { LoggerMiddleware } from "@medical-musculoskeletal/logger";
import { Global, MiddlewareConsumer, Module } from "@nestjs/common";
import { AdminApiController } from "./admin-api.controller";
import { CategoryAdminApiModule } from "@/category-admin-api/category-admin.module";
import { StoryAdminApiModule } from "@/story-admin-api/story-admin.module";
import { AdminCategoryController } from "@/category-admin-api/category-admin.controller";
import { AdminStoryController } from "@/story-admin-api/story-admin.controller";
import { CategoryModule } from "@/category/category.module";
import { StoryModule } from "@/story/story.module";

@Global()
@Module({
  imports: [
    CoreModule,
    MusculoskeletalAdminApiModule,
    MusculoskeletalModule,
    CategoryAdminApiModule,
    StoryAdminApiModule,
    CategoryModule,
    StoryModule,
  ],
  controllers: [
    AdminApiController,
    AdminMusculoskeletalController,
    AdminCategoryController,
    AdminStoryController,
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

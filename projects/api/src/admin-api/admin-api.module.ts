import { AdminCategoryController } from '@/category-admin-api/category-admin.controller';
import { CategoryAdminApiModule } from '@/category-admin-api/category-admin.module';
import { CategoryModule } from '@/category/category.module';
import { CoreModule } from '@/core/core.module';
import { AdminStoryController } from '@/story-admin-api/story-admin.controller';
import { StoryAdminApiModule } from '@/story-admin-api/story-admin.module';
import { StoryModule } from '@/story/story.module';
import { LoggerMiddleware } from '@medical-musculoskeletal/logger';
import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { AdminApiController } from './admin-api.controller';

@Global()
@Module({
  imports: [CoreModule, CategoryAdminApiModule, StoryAdminApiModule, CategoryModule, StoryModule],
  controllers: [AdminApiController, AdminCategoryController, AdminStoryController],
  providers: [
    // {
    //   provide: APP_FILTER,
    //   useClass: AdminAPIExceptionFilter,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: AdminAuthGuard,
    // },
  ]
})
export class AdminAPIModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}

import { CoreModule } from "@/core/core.module";
import { AdminMusculoskeletalController } from "@/musculoskeletal-admin-api/musculoskeletal-admin.controller";
import { MusculoskeletalAdminApiModule } from "@/musculoskeletal-admin-api/musculoskeletal-admin.module";
import { MusculoskeletalModule } from "@/musculoskeletal/musculoskeletal.module";
import { LoggerMiddleware } from "@medical-musculoskeletal/logger";
import { Global, MiddlewareConsumer, Module } from "@nestjs/common";
import { AdminApiController } from "./admin-api.controller";

@Global()
@Module({
  imports: [CoreModule, MusculoskeletalAdminApiModule, MusculoskeletalModule],
  controllers: [AdminApiController, AdminMusculoskeletalController],
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

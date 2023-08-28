import { ContextMiddleware } from "@medical-musculoskeletal/context";
import { LoggerMiddleware } from "@medical-musculoskeletal/logger";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { CoreModule } from "./core/core.module";
import { HttpRequestIdMiddleware } from "./http-x-request-id.middleware";
import { MusculoskeletalApiModule } from "./musculoskeletal-api/musculoskeletal.module";

@Module({
  imports: [CoreModule, MusculoskeletalApiModule],
  controllers: [AppController],
  providers: [
    // ThrottlerModule.forRootAsync({
    //   useFactory: (redis: RedisService) => {
    //     const client = redis.getClient();
    //     return {
    //       limit: 10, // 10 requests per second per endpoint by default
    //       ttl: 1,
    //       storage: new ThrottlerStorageRedisService(client as unknown as Redis)
    //     };
    //   },
    //   inject: [RedisService]
    // }),
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ContextMiddleware(), HttpRequestIdMiddleware(), LoggerMiddleware)
      .forRoutes("*");
  }
}

import { Global, Module, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import assert from "assert";
import moment from "moment";
import os from "os";
import pg from "pg";
import { Musculoskeletal } from "../musculoskeletal/musculoskeletal.entity";

export const models = [Musculoskeletal];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DB_URL,
      applicationName: os.hostname(),
      keepConnectionAlive: true,
      extra: {
        idleTimeoutMillis: 10000,
        max: process.env.DB_POOL_MAX ? Number(process.env.DB_POOL_MAX) : 10,
        min: process.env.DB_POOL_MIN ? Number(process.env.DB_POOL_MIN) : 5,
      },
      autoLoadEntities: true,
      synchronize: false,
      logging: false,
      entities: models,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule implements OnModuleInit {
  onModuleInit() {
    assert(process.env.DB_URL, "url is not defined");
    pg.types.setTypeParser(1114, (str) => moment.utc(str).format());
  }
}

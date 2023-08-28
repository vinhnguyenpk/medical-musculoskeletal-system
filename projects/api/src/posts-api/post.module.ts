import { Module } from "@nestjs/common";
import { PostController } from "./post.controller";
import { PostModule } from "../posts/post.module";

@Module({
  imports: [PostModule],
  controllers: [PostController],
})
export class PostApiModule {}

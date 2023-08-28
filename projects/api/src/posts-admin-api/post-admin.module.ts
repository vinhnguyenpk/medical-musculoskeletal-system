import { Module } from "@nestjs/common";
import { AdminPostController } from "./post-admin.controller";
import { PostModule } from "../posts/post.module";

@Module({
  imports: [PostModule],
  controllers: [AdminPostController],
})
export class PostAdminApiModule {}

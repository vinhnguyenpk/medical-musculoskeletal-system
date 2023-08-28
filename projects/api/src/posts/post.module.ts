import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./post.entity";
import { PostService } from "./post.service";

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}

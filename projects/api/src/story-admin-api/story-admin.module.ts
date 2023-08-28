import { Module } from "@nestjs/common";
import { AdminStoryController } from "./story-admin.controller";
import { StoryModule } from "../story/story.module";

@Module({
  imports: [StoryModule],
  controllers: [AdminStoryController],
})
export class StoryAdminApiModule {}

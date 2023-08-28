import { Module } from "@nestjs/common";
import { StoryController } from "./story.controller";
import { StoryModule } from "../story/story.module";

@Module({
  imports: [StoryModule],
  controllers: [StoryController],
})
export class StoryApiModule {}

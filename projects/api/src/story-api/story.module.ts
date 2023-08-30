import { Module } from '@nestjs/common';
import { StoryModule } from '../story/story.module';
import { StoryController } from './story.controller';

@Module({
  imports: [StoryModule],
  controllers: [StoryController]
})
export class StoryApiModule {}

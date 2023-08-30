import { PaginatedList } from '@/pagination/types';
import { StoryService } from '@/story/story.service';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetStoryRequest, GetStoryResponse } from './story.view';

@ApiTags('Story')
@Controller('/story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get('/')
  @ApiQuery({
    name: 'pageSize',
    description: 'Page size',
    required: false,
    type: Number
  })
  @ApiQuery({
    name: 'current',
    description: 'Current',
    required: false,
    type: Number
  })
  @ApiQuery({
    name: 'keywords',
    description: 'Keywords',
    required: false,
    type: String
  })
  @ApiQuery({
    name: 'categoryId',
    description: 'Category Id',
    required: false,
    type: String
  })
  public async getAll(@Query() request: GetStoryRequest): Promise<PaginatedList<GetStoryResponse>> {
    return await this.storyService.getAll(request);
  }
}

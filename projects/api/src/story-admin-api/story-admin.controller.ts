import { Body, Controller, Get, HttpException, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { exceptions } from '@medical-musculoskeletal/logger';
import { PaginatedList } from '../pagination/types';
import { StoryService } from '../story/story.service';
import {
  AdminCreateStoryParams,
  AdminCreateStoryResponse,
  AdminGetStoryRequest,
  AdminGetStoryResponse,
  AdminUpdateStoryParams,
  AdminUpdateStoryResponse
} from './story-admin.view';

@ApiTags('Story')
@Controller('/story')
@ApiBearerAuth()
export class AdminStoryController {
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
    name: 'content',
    description: 'Content',
    required: false,
    type: String
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
  public async getAll(@Query() request: AdminGetStoryRequest): Promise<PaginatedList<AdminGetStoryResponse>> {
    return await this.storyService.getAll(request);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', description: 'Story Id', required: true })
  @ApiOkResponse({
    description: 'Get Story By Id',
    type: AdminGetStoryResponse
  })
  public async getStoryById(@Param('id') id: string): Promise<AdminGetStoryResponse> {
    try {
      const data = await this.storyService.getById(id);
      if (!data) {
        throw new NotFoundException('Story not found');
      }

      return data;
    } catch (e) {
      const ex = exceptions('[Get Story error]', e);
      throw new HttpException(ex.message, ex.statusCode);
    }
  }

  @Post('/create')
  async createStory(@Body() params: AdminCreateStoryParams): Promise<AdminCreateStoryResponse> {
    try {
      return await this.storyService.createStory(params);
    } catch (e) {
      const ex = exceptions('[Create Story error]', e);
      throw new HttpException(ex.message, ex.statusCode);
    }
  }

  @Post('/:id/edit')
  async updateStory(@Param('id') id: string, @Body() params: AdminUpdateStoryParams): Promise<AdminUpdateStoryResponse> {
    try {
      return await this.storyService.updateStory(id, params);
    } catch (e) {
      const ex = exceptions('[Update Story error]', e);
      throw new HttpException(ex.message, ex.statusCode);
    }
  }
}

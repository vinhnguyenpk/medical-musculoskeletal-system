import {
  Body,
  Controller,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import {
  AdminCreateStoryParams,
  AdminCreateStoryResponse,
  AdminGetStoryRequest,
  AdminGetStoryResponse,
  AdminUpdateStoryParams,
  AdminUpdateStoryResponse,
} from "./story-admin.view";
import { PaginatedList } from "../pagination/types";
import { StoryService } from "../story/story.service";
import { exceptions } from "packages/medical-musculoskeletal-logger/src/lib/logger";

@ApiTags("Story")
@Controller("/story")
@ApiBearerAuth()
export class AdminStoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get("/")
  @ApiQuery({
    name: "pageSize",
    description: "Page size",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "current",
    description: "Current",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "content",
    description: "Content",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "keywords",
    description: "Keywords",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "categoryId",
    description: "Category Id",
    required: false,
    type: String,
  })
  public async getAll(
    @Query() request: AdminGetStoryRequest
  ): Promise<PaginatedList<AdminGetStoryResponse>> {
    const data = await this.storyService.getAll(request);
    return {
      data: data.data.map((m) => {
        return {
          id: m.id,
          content: m.content,
          keywords: m.keywords,
          categoryId: m.categoryId,
          createdAt: m.createdAt,
          updatedAt: m.updatedAt,
        };
      }),
      total: data.total,
    };
  }

  @Get("/:id")
  @ApiParam({ name: "id", description: "Story Id", required: true })
  @ApiOkResponse({
    description: "Get Story By Id",
    type: AdminGetStoryResponse,
  })
  public async getStoryById(
    @Param("id") id: string
  ): Promise<AdminGetStoryResponse> {
    try {
      const data = await this.storyService.getById(id);
      if (!data) {
        throw new NotFoundException("Story not found");
      }

      return {
        id: data.id,
        content: data.content,
        keywords: data.keywords,
        categoryId: data.categoryId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    } catch (e) {
      const ex = exceptions("[Get Story error]", e);
      throw new HttpException(ex.message, ex.statusCode);
    }
  }

  @Post("/create")
  async createStory(
    @Body() params: AdminCreateStoryParams
  ): Promise<AdminCreateStoryResponse> {
    try {
      return await this.storyService.createStory(params);
    } catch (e) {
      const ex = exceptions("[Create Story error]", e);
      throw new HttpException(ex.message, ex.statusCode);
    }
  }

  @Post("/:id/edit")
  async updateStory(
    @Param("id") id: string,
    @Body() params: AdminUpdateStoryParams
  ): Promise<AdminUpdateStoryResponse> {
    try {
      return await this.storyService.updateStory(id, params);
    } catch (e) {
      const ex = exceptions("[Update Story error]", e);
      throw new HttpException(ex.message, ex.statusCode);
    }
  }
}

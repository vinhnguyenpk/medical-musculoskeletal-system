import { PaginatedList } from "@/pagination/types";
import {
  AdminGetStoryRequest,
  AdminGetStoryResponse,
} from "@/story-admin-api/story-admin.view";
import { StoryService } from "@/story/story.service";
import { Controller, Get, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { GetStoryRequest, GetStoryResponse } from "./story.view";

@ApiTags("Story")
@Controller("/story")
export class StoryController {
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
    @Query() request: GetStoryRequest
  ): Promise<PaginatedList<GetStoryResponse>> {
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
}

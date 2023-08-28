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
  AdminCreatePostParams,
  AdminCreatePostResponse,
  AdminGetPostRequest,
  AdminGetPostResponse,
  AdminUpdatePostParams,
  AdminUpdatePostResponse,
} from "./post-admin.view";
import { PaginatedList } from "../pagination/types";
import { PostService } from "../posts/post.service";
import { exceptions } from "packages/medical-musculoskeletal-logger/src/lib/logger";

@ApiTags("Post")
@Controller("/post")
@ApiBearerAuth()
export class AdminPostController {
  constructor(private readonly postService: PostService) {}

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
    @Query() request: AdminGetPostRequest
  ): Promise<PaginatedList<AdminGetPostResponse>> {
    const data = await this.postService.getAll(request);
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
  @ApiParam({ name: "id", description: "Post Id", required: true })
  @ApiOkResponse({
    description: "Get Post By Id",
    type: AdminGetPostResponse,
  })
  public async getPostById(
    @Param("id") id: string
  ): Promise<AdminGetPostResponse> {
    try {
      const data = await this.postService.getById(id);
      if (!data) {
        throw new NotFoundException("Post not found");
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
      const ex = exceptions("[Get Post error]", e);
      throw new HttpException(ex.message, ex.statusCode);
    }
  }

  @Post("/create")
  async createPost(
    @Body() params: AdminCreatePostParams
  ): Promise<AdminCreatePostResponse> {
    try {
      return await this.postService.createPost(params);
    } catch (e) {
      const ex = exceptions("[Create Post error]", e);
      throw new HttpException(ex.message, ex.statusCode);
    }
  }

  @Post("/:id/edit")
  async updatePost(
    @Param("id") id: string,
    @Body() params: AdminUpdatePostParams
  ): Promise<AdminUpdatePostResponse> {
    try {
      return await this.postService.updatePost(id, params);
    } catch (e) {
      const ex = exceptions("[Update Post error]", e);
      throw new HttpException(ex.message, ex.statusCode);
    }
  }
}

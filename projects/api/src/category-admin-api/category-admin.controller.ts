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
import { CategoryService } from "../category/category.service";
import {
  AdminCreateCategoryParams,
  AdminCreateCategoryResponse,
  AdminGetCategoryRequest,
  AdminGetCategoryResponse,
  AdminUpdateCategoryParams,
  AdminUpdateCategoryResponse,
} from "./category-admin.view";
import { PaginatedList } from "../pagination/types";
import { exceptions } from "packages/medical-musculoskeletal-logger/src/lib/logger";

@ApiTags("Category")
@Controller("/category")
@ApiBearerAuth()
export class AdminCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

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
    name: "name",
    description: "Name",
    required: false,
    type: String,
  })
  public async getAllCategory(
    @Query() request: AdminGetCategoryRequest
  ): Promise<PaginatedList<AdminGetCategoryResponse>> {
    const data = await this.categoryService.getAll(request);
    return {
      data: data.data.map((m) => {
        return {
          id: m.id,
          name: m.name,
          createdAt: m.createdAt,
          updatedAt: m.updatedAt,
        };
      }),
      total: data.total,
    };
  }

  @Get("/:id")
  @ApiParam({ name: "id", description: "Category Id", required: true })
  @ApiOkResponse({
    description: "Get Category By Id",
    type: AdminGetCategoryResponse,
  })
  public async getCategoryById(
    @Param("id") id: string
  ): Promise<AdminGetCategoryResponse> {
    try {
      const data = await this.categoryService.getById(id);
      if (!data) {
        throw new NotFoundException("Category not found");
      }

      return {
        id: data.id,
        name: data.name,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    } catch (e) {
      const ex = exceptions("[Get Category error]", e);
      throw new HttpException(ex.message, ex.statusCode);
    }
  }

  @Post("/create")
  async createCategory(
    @Body() params: AdminCreateCategoryParams
  ): Promise<AdminCreateCategoryResponse> {
    try {
      return await this.categoryService.createCategory(params);
    } catch (e) {
      const ex = exceptions("[Create Category error]", e);
      throw new HttpException(ex.message, ex.statusCode);
    }
  }

  @Post("/:id/edit")
  async editCategory(
    @Param("id") id: string,
    @Body() params: AdminUpdateCategoryParams
  ): Promise<AdminUpdateCategoryResponse> {
    try {
      return await this.categoryService.updateCategory(id, params);
    } catch (e) {
      const ex = exceptions("[Update Category error]", e);
      throw new HttpException(ex.message, ex.statusCode);
    }
  }
}

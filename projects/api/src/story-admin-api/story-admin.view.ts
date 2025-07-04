import { Category } from '@/category/category.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AdminCreateStoryParams {
  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  keywords: string;

  @ApiProperty({ required: false })
  content: string;

  @ApiProperty({ required: true })
  categoryId: string;
}

export class AdminCreateStoryResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  shortContent: string;

  @ApiProperty()
  keywords?: string;

  @ApiProperty()
  content?: string;

  @ApiProperty()
  categoryId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class AdminUpdateStoryParams {
  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  keywords: string;

  @ApiProperty({ required: false })
  content: string;

  @ApiProperty({ required: true })
  categoryId: string;
}

export class AdminUpdateStoryResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  shortContent: string;

  @ApiProperty()
  keywords?: string;

  @ApiProperty()
  content?: string;

  @ApiProperty()
  categoryId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class AdminGetStoryRequest {
  @ApiProperty()
  title?: string;

  @ApiProperty()
  shortContent?: string;

  @ApiProperty()
  categoryId?: string;

  @ApiProperty()
  keywords?: string;

  @ApiProperty()
  content?: string;

  @ApiProperty()
  current?: number;

  @ApiProperty()
  pageSize?: number;
}

export class AdminGetStoryResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  shortContent: string;

  @ApiProperty()
  category: Category;

  @ApiProperty()
  keywords: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

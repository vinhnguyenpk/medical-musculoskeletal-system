import { ApiProperty } from '@nestjs/swagger';

export class AdminCreateCategoryParams {
  @ApiProperty({ required: true })
  name: string;
}

export class AdminCreateCategoryResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class AdminUpdateCategoryParams {
  @ApiProperty({ required: true })
  name: string;
}

export class AdminUpdateCategoryResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class AdminGetCategoryRequest {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  current?: number;

  @ApiProperty()
  pageSize?: number;
}

export class AdminGetCategoryResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

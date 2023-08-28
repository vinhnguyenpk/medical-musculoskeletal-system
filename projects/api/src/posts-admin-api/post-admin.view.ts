import { ApiProperty } from "@nestjs/swagger";

export class AdminCreatePostParams {
  @ApiProperty({ required: false })
  keywords: string;

  @ApiProperty({ required: false })
  content: string;

  @ApiProperty({ required: true })
  categoryId: string;
}

export class AdminCreatePostResponse {
  @ApiProperty()
  id: string;

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

export class AdminUpdatePostParams {
  @ApiProperty({ required: false })
  keywords: string;

  @ApiProperty({ required: false })
  content: string;

  @ApiProperty({ required: true })
  categoryId: string;
}

export class AdminUpdatePostResponse {
  @ApiProperty()
  id: string;

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

export class AdminGetPostRequest {
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

export class AdminGetPostResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  keywords: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

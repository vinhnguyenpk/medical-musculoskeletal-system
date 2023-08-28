import { ApiProperty } from "@nestjs/swagger";

export class GetStoryRequest {
  @ApiProperty()
  categoryId?: string;

  @ApiProperty()
  keywords?: string;

  @ApiProperty()
  current?: number;

  @ApiProperty()
  pageSize?: number;
}

export class GetStoryResponse {
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

export interface StoryDto {
  id: string;
  keywords: string;
  content: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStoryParams {
  keywords: string;
  content: string;
  categoryId: string;
}

export class UpdateStoryParams {
  keywords: string;
  content: string;
  categoryId: string;
}

export class GetStoryParams {
  keywords?: string;
  content?: string;
  categoryId?: string;
  current?: number;
  pageSize?: number;
}

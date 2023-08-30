import { Category } from '@/category/category.entity';

export interface StoryDto {
  id: string;
  title: string;
  shortContent: string;
  keywords: string;
  content: string;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStoryParams {
  title: string;
  keywords: string;
  content: string;
  categoryId: string;
}

export class UpdateStoryParams {
  title: string;
  keywords: string;
  content: string;
  categoryId: string;
}

export class GetStoryParams {
  keywords?: string;
  title?: string;
  shortContent?: string;
  content?: string;
  categoryId?: string;
  current?: number;
  pageSize?: number;
}

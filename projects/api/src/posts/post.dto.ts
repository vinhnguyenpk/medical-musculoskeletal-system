export interface PostDto {
  id: string;
  keywords: string;
  content: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostParams {
  keywords: string;
  content: string;
  categoryId: string;
}

export class UpdatePostParams {
  keywords: string;
  content: string;
  categoryId: string;
}

export class GetPostParams {
  keywords?: string;
  content?: string;
  categoryId?: string;
  current?: number;
  pageSize?: number;
}

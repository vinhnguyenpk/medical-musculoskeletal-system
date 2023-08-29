import { Category } from '@/services/category';
import { RequestData } from '@ant-design/pro-table';
import { request } from 'umi';

export interface Story {
  id: string;
  content: string;
  keywords: string;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminGetListStoryParams {
  content?: string;
  keywords?: string;
  categoryId?: string;
  current?: number;
  pageSize?: number;
}

export interface AdminCreateStoryParams {
  keywords: string;
  categoryId: string;
  content: string;
}

export interface AdminUpdateStoryParams {
  id: string;
  keywords: string;
  categoryId: string;
  content: string;
}

export interface AdminGetListStoryResponse extends Story {}

export interface AdminUpdateStoryResponse extends Story {}

export interface AdminCreateStoryResponse extends Story {}

export async function queryListStory(
  params: AdminGetListStoryParams,
): Promise<RequestData<AdminGetListStoryResponse>> {
  return await request<RequestData<AdminGetListStoryResponse>>(`/story`, { params });
}

export async function queryStoryById(params: { id: string }): Promise<AdminGetListStoryResponse> {
  return await request<AdminGetListStoryResponse>(`/story/${params.id}`);
}

export async function updateStory(data: AdminUpdateStoryParams): Promise<AdminUpdateStoryResponse> {
  return await request<AdminUpdateStoryResponse>(`/story/${data.id}/edit`, {
    method: 'post',
    data: {
      keywords: data.keywords,
      categoryId: data.categoryId,
      content: data.content,
    },
  });
}

export async function createStory(data: AdminCreateStoryParams): Promise<AdminCreateStoryResponse> {
  return await request<AdminCreateStoryResponse>(`/story/create`, {
    method: 'post',
    data: {
      keywords: data.keywords,
      categoryId: data.categoryId,
      content: data.content,
    },
  });
}

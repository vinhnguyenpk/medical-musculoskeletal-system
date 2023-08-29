import { RequestData } from '@ant-design/pro-table';
import { request } from 'umi';

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminGetListCategoryParams {
  name?: string;
  current?: number;
  pageSize?: number;
}

export interface AdminCreateCategoryParams {
  name: string;
}

export interface AdminUpdateCategoryParams {
  id: string;
  name: string;
}

export interface AdminGetListCategoryResponse extends Category {}

export interface AdminUpdateCategoryResponse extends Category {}

export interface AdminCreateCategoryResponse extends Category {}

export async function queryListCategory(
  params: AdminGetListCategoryParams,
): Promise<RequestData<AdminGetListCategoryResponse>> {
  return await request<RequestData<AdminGetListCategoryResponse>>(`/category`, { params });
}

export async function queryCategoryById(params: {
  id: string;
}): Promise<AdminGetListCategoryResponse> {
  return await request<AdminGetListCategoryResponse>(`/category/${params.id}`);
}

export async function updateCategory(
  data: AdminUpdateCategoryParams,
): Promise<AdminUpdateCategoryResponse> {
  return await request<AdminUpdateCategoryResponse>(`/category/${data.id}/edit`, {
    method: 'post',
    data: {
      name: data.name,
    },
  });
}

export async function createCategory(
  data: AdminCreateCategoryParams,
): Promise<AdminCreateCategoryResponse> {
  return await request<AdminCreateCategoryResponse>(`/category/create`, {
    method: 'post',
    data: {
      name: data.name,
    },
  });
}

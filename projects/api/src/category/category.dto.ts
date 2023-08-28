export interface CategoryDto {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryParams {
  name: string;
}

export class UpdateCategoryParams {
  name: string;
}

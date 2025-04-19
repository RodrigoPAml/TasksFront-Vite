import api from './Api';
import { BaseResponse } from '../types/api/BaseResponse';
import { GetAllResponse } from '../types/api/GetAllResponse';
import { Category } from '../types/entities/Category';
import { EmptyResponse } from '../types/api/EmptyResponse';

export const CategoryService = {
  getAll: async (): Promise<BaseResponse<GetAllResponse<Category>>> => {
    return await api.get('/category/getAll');
  },

  get: async (id: number): Promise<BaseResponse<Category>> => {
    return await api.get('/category?id=' + id);
  },

  create: async (category: Omit<Category, 'id'>): Promise<EmptyResponse> => {
    return await api.post('/category', category);
  },

  update: async (category: Category): Promise<EmptyResponse> => {
    return await api.put('/category', category);
  },

  delete: async (id: number): Promise<EmptyResponse> => {
    return await api.delete('/category?id=' + id);
  },
};
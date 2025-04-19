import api from './Api';
import { BaseResponse } from '../types/api/BaseResponse';
import { GetPagedResponse } from '../types/api/GetPagedResponse';
import { EmptyResponse } from '../types/api/EmptyResponse';
import { Task } from '../types/entities/Task';
import { TasksFilterModel } from '../types/models/TaskFilterModel';
import { TaskOrderByEnum } from '../types/enums/TaskOrderByEnum';
import { formatDateBackEnd } from '../utils/formatDateBackEnd';

export const TaskService = {
  getPaged: async (
    pageNumber: number,
    pageSize: number,
    filter?: TasksFilterModel,
    ordering?: TaskOrderByEnum,
  ): Promise<BaseResponse<GetPagedResponse<Task>>> => {
    let url = `/Task/getPaged?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (filter) {
      if (filter.categoryId) url += `&categoryId=${filter.categoryId}`;
      if (filter.name) url += `&name=${encodeURIComponent(filter.name)}`;
      if (filter.status !== undefined) url += `&status=${filter.status}`;
      if (filter.priority !== undefined) url += `&priority=${filter.priority}`;
    }

    if (ordering !== undefined) {
      url += `&ordering=${ordering}`;
    }

    return await api.get(url);
  },

  get: async (id: number): Promise<BaseResponse<Task>> => {
    return await api.get('/Task?id=' + id);
  },

  create: async (task: Omit<Task, 'id'>): Promise<EmptyResponse> => {
    task.dueDate = formatDateBackEnd(task.dueDate);
    return await api.post('/Task', task);
  },

  update: async (task: Task): Promise<EmptyResponse> => {
    task.dueDate = formatDateBackEnd(task.dueDate);
    return await api.put('/Task', task);
  },

  delete: async (id: number): Promise<EmptyResponse> => {
    return await api.delete('/Task?id=' + id);
  },
};
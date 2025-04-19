import { TaskPriorityEnum } from "../enums/TaskPriorityEnum";
import { TaskStatusEnum } from "../enums/TaskStatusEnum";

export interface TasksFilterModel {
  categoryId?: number;
  name?: string;
  status?: TaskStatusEnum;
  priority?: TaskPriorityEnum;
}
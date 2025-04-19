import { TaskPriorityEnum } from "../enums/TaskPriorityEnum";
import { TaskStatusEnum } from "../enums/TaskStatusEnum";

export interface Task {
  id: number;
  name: string;
  description?: string;
  status: TaskStatusEnum;
  priority: TaskPriorityEnum;
  dueDate?: string;
  categoryId: number;
}
import { TaskStatusEnum } from '../../../types/enums/TaskStatusEnum';
import { TaskPriorityEnum } from '../../../types/enums/TaskPriorityEnum';

export const getStatusClassName = (status: TaskStatusEnum, styles: Record<string, string>): string => {
  switch (status) {
    case TaskStatusEnum.Pending: return styles.statusPending;
    case TaskStatusEnum.InProgress: return styles.statusInProgress;
    case TaskStatusEnum.Completed: return styles.statusCompleted;
    case TaskStatusEnum.Paused: return styles.statusPaused;
    case TaskStatusEnum.Cancelled: return styles.statusCancelled;
    default: return styles.statusPaused;
  }
};

export const getPriorityClassName = (priority: TaskPriorityEnum, styles: Record<string, string>): string => {
  switch (priority) {
    case TaskPriorityEnum.None: return styles.priorityNone;
    case TaskPriorityEnum.Low: return styles.priorityLow;
    case TaskPriorityEnum.Medium: return styles.priorityMedium;
    case TaskPriorityEnum.High: return styles.priorityHigh;
    case TaskPriorityEnum.Urgent: return styles.priorityUrgent;
    default: return styles.priorityNone;
  }
};
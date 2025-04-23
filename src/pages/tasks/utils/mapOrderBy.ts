import { TaskOrderByEnum } from "../../../types/enums/TaskOrderByEnum";

export const mapOrderBy = (columnName: string, asc?: boolean): TaskOrderByEnum | undefined => {
  if (!columnName || asc === undefined)
    return undefined;

  switch (columnName) {
    case 'id':
      return (asc && asc === true) ? TaskOrderByEnum.IdAsc : TaskOrderByEnum.IdDesc;
    case 'name':
      return (asc && asc === true) ? TaskOrderByEnum.NameAsc : TaskOrderByEnum.NameDesc;
    case 'dueDate':
      return (asc && asc === true) ? TaskOrderByEnum.DueDateAsc : TaskOrderByEnum.DueDateDesc;
    case 'priority':
      return (asc && asc === true) ? TaskOrderByEnum.PriorityAsc : TaskOrderByEnum.PriorityDesc;
    default:
      return undefined;
  }
};
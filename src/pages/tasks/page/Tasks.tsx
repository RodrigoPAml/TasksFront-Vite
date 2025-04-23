import React, { useState } from 'react';
import Table from '../../../components/table/Table';
import Button from '../../../components/button/Button';
import AddEditModal from '../add-edit-modal/AddEditModal';
import DeleteModal from '../delete-modal/DeleteModal';
import { Task } from '../../../types/entities/Task';
import { TaskStatusEnum } from '../../../types/enums/TaskStatusEnum';
import { TaskPriorityEnum } from '../../../types/enums/TaskPriorityEnum';
import { useSnackbar } from '../../../contexts/snackbar/SnackbarContext';
import { useServices } from '../../../contexts/services/ServicesContext';
import { getStatusClassName, getPriorityClassName } from '../utils/statusStyles';
import { mapOrderBy } from '../utils/mapOrderBy';
import FilterModal from '../filter-modal/FilterModal';
import styles from './Tasks.module.css';
import { TasksFilterModel } from '../../../types/models/TaskFilterModel';

const Tasks: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  const { taskService } = useServices();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [filters, setFilters] = useState<TasksFilterModel | undefined>(undefined);
  const [items, setItems] = useState<Task[]>([]);
  const [item, setItem] = useState<Task | undefined>(undefined);
  const [totalItems, setTotalItems] = useState(0);
  const [modalOpen, setModalOpen] = useState<'add-edit' | 'delete' | 'filters' | 'none'>('none');

  const fetchTasks = async (pageNumber: number, pageSize: number, sortColumn: string, sortAsc?: boolean) => {
    setLoading(true);

    const orderBy = mapOrderBy(sortColumn, sortAsc);
    const categories = await taskService.getPaged(pageNumber + 1, pageSize, filters, orderBy);

    if (categories.success) {
      setItems(categories.data?.items!);
      setTotalItems(categories.data?.count!);
    } else {
      showSnackbar(categories.errorMessage!, 'error');
    }
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <h1 className={styles.title}>Tasks</h1>
        <div className='flex gap-2'>
          <Button
            title="Add"
            onClick={() => setModalOpen('add-edit')} className={styles.headerButton}>
            <svg height='1rem' fill='white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
            </svg>
          </Button>
          <Button
            title="Filters"
            onClick={() => setModalOpen('filters')} className={styles.headerButton}>
            <svg height='1rem' fill='white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
            </svg>
          </Button>
        </div>
      </div>
      <Table<Task>
        columns={[
          { key: 'id', header: 'Id', sortable: true, minSize: 80, size: 80 },
          { key: 'name', header: 'Name', sortable: true, minSize: 500, size: 500 },
          {
            key: 'status',
            header: 'Status',
            sortable: false,
            minSize: 150,
            size: 150,
            cell: (value) => {
              return (
                <span className={`${styles.statusLabel} ${getStatusClassName(value, styles)}`}>
                  {TaskStatusEnum[value]}
                </span>
              );
            }
          },
          {
            key: 'priority',
            header: 'Priority',
            sortable: true,
            minSize: 150,
            size: 120,
            cell: (value) => {
              return (
                <span className={`${styles.priorityLabel} ${getPriorityClassName(value, styles)}`}>
                  {TaskPriorityEnum[value]}
                </span>
              );
            }
          },
          {
            key: 'dueDate',
            header: 'Due Date',
            sortable: true,
            minSize: 150,
            size: 150,
            cell: (value) => {
              if (value === null)
                return <span>None</span>
              return <span>{new Date(value).toLocaleDateString()}</span>
            }
          },
          {
            key: 'actions',
            minSize: 10,
            size: 50,
            sortable: false,
            cell: (_, row) => {
              return <div className='flex flex-row align-center w-full justify-end gap-5 pr-2'>
                <button
                  title="Edit"
                  className={styles.editButton}
                  onClick={() => {
                    setItem(row);
                    setModalOpen('add-edit');
                  }}
                >
                  <svg height='1rem' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                  </svg>
                </button>
                <button
                  title="Delete"
                  className={styles.deleteButton}
                  onClick={() => {
                    setItem(row);
                    setModalOpen('delete');
                  }}
                >
                  <svg height='1rem' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                  </svg>
                </button>
              </div>
            }
          }
        ]}
        className="h-[calc(90vh-220px)] mt-4"
        data={items}
        loading={loading}
        refresh={refresh}
        withPagination
        pageSize={9}
        onPaginationChange={(pageNumber: number, pageSize: number, sortColumn: string, sortAsc?: boolean) =>
          fetchTasks(pageNumber, pageSize, sortColumn, sortAsc)
        }
        totalRows={totalItems}
        mode='server'
      />
      <AddEditModal
        isOpen={modalOpen === 'add-edit'}
        onClose={() => {
          setModalOpen('none')
          setItem(undefined);
        }}
        onSuccess={() => {
          setModalOpen('none')
          setItem(undefined);
          setRefresh(!refresh);
        }}
        id={item?.id}
      />
      <DeleteModal
        isOpen={modalOpen === 'delete'}
        onClose={() => {
          setModalOpen('none')
          setItem(undefined);
        }}
        onSuccess={() => {
          setModalOpen('none')
          setItem(undefined);
          setRefresh(!refresh);
        }}
        item={item}
      />
      <FilterModal
        isOpen={modalOpen === 'filters'}
        onClose={() => setModalOpen('none')}
        onSuccess={(filter: TasksFilterModel) => {
          setModalOpen('none')
          setFilters(filter);
          setRefresh(!refresh);
        }}
      />
    </div>
  );
};

export default Tasks;
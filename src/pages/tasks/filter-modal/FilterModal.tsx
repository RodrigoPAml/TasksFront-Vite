import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useServices } from '../../../contexts/services/ServicesContext';
import { useSnackbar } from '../../../contexts/snackbar/SnackbarContext';
import Modal from '../../../components/modal/Modal';
import Button from '../../../components/button/Button';
import TextField from '../../../components/text-field/TextField';
import SelectInput from '../../../components/select-input/SelectInput';
import { TaskPriorityEnum } from '../../../types/enums/TaskPriorityEnum';
import { TaskStatusEnum } from '../../../types/enums/TaskStatusEnum';
import { Category } from '../../../types/entities/Category';
import { TasksFilterModel } from '../../../types/models/TaskFilterModel';
import styles from './FilterModal.module.css';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (filter: TasksFilterModel) => void;
  id?: number;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TasksFilterModel>({});
  const { categoryService } = useServices();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    reset({
      name: '',
      categoryId: undefined,
      status: undefined,
      priority: undefined,
    });
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchTask();
    }
  }, [isOpen]);

  const onSubmit = async (data: TasksFilterModel) => {
    if (data) {
      onSuccess(data);
    }
  };

  const fetchTask = async () => {
    setLoading(true);
    const response = await categoryService.getAll();

    if (response.success) {
      setCategories(response.data?.items!);
    } else {
      showSnackbar(response.errorMessage!, 'error');
      onClose();
      setLoading(false);
      return;
    }

    setTimeout(() => setLoading(false), 500);
  };

  return (
    <Modal isOpen={isOpen} className={styles.modal}>
      <div className={styles.header}>
        <h2 className={styles.title}>Filters</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <TextField
            id="name"
            label="Name"
            className='mb-4'
            disabled={loading}
            placeholder="Enter the name"
            error={errors.name?.message}
            registration={register('name', {
              minLength: {
                value: 1,
                message: 'Name must be at least 1 character'
              },
              maxLength: {
                value: 128,
                message: 'Name must be at most 128 characters'
              },
            })}
          />
          <SelectInput
            id="categoryId"
            label="Category"
            className='mb-4'
            disabled={loading}
            placeholder="Select a category"
            error={errors.categoryId?.message}
            options={categories.map((category) => {
              return {
                value: category.id,
                label: category.name
              };
            })}
            registration={register('categoryId', {
              setValueAs: (value) => value === "" ? undefined : Number(value),
            })}
          />
          <SelectInput
            id="status"
            label="Status"
            className='mb-4'
            disabled={loading}
            placeholder="Select a status"
            error={errors.status?.message}
            options={[
              { value: TaskStatusEnum.Pending, label: 'Pending' },
              { value: TaskStatusEnum.InProgress, label: 'In Progress' },
              { value: TaskStatusEnum.Completed, label: 'Completed' },
              { value: TaskStatusEnum.Paused, label: 'Paused' },
              { value: TaskStatusEnum.Cancelled, label: 'Cancelled' }
            ]}
            registration={register('status', {
              setValueAs: (value) => value === "" ? undefined : Number(value),
            })}
          />
          <SelectInput
            id="priority"
            label="Priority"
            className='mb-6'
            disabled={loading}
            placeholder="Select a priority"
            error={errors.priority?.message}
            options={[
              { value: TaskPriorityEnum.None, label: 'None' },
              { value: TaskPriorityEnum.Low, label: 'Low' },
              { value: TaskPriorityEnum.Medium, label: 'Medium' },
              { value: TaskPriorityEnum.High, label: 'High' },
              { value: TaskPriorityEnum.Urgent, label: 'Urgent' }
            ]}
            registration={register('priority', {
              setValueAs: (value) => value === "" ? undefined : Number(value),
            })}
          />
        </div>
      </form>
      <div className={styles.footer}>
        <Button disabled={loading} onClick={onClose} variant='secondary'>
          Cancel
        </Button>
        <Button loading={loading} onClick={handleSubmit(onSubmit)}>
          Apply
        </Button>
      </div>
    </Modal>
  );
};

export default FilterModal;
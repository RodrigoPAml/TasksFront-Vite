import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useServices } from '../../../contexts/services/ServicesContext';
import { useSnackbar } from '../../../contexts/snackbar/SnackbarContext';
import Modal from '../../../components/modal/Modal';
import Button from '../../../components/button/Button';
import TextArea from '../../../components/text-area/TextArea';
import TextField from '../../../components/text-field/TextField';
import SelectInput from '../../../components/select-input/SelectInput';
import DateInput from '../../../components/date-input/DateInput';
import { TaskPriorityEnum } from '../../../types/enums/TaskPriorityEnum';
import { TaskStatusEnum } from '../../../types/enums/TaskStatusEnum';
import { Category } from '../../../types/entities/Category';
import styles from './AddEditModal.module.css';

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  id?: number;
}

interface TaskFormData {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  status: number;
  priority: number;
  dueDate: string;
}

const AddEditModal: React.FC<AddEditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  id,
}) => {
  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm<TaskFormData>();
  const { taskService, categoryService } = useServices();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const isUpdate = !!id;

  useEffect(() => {
    reset({
      id: undefined,
      name: '',
      categoryId: undefined,
      status: undefined,
      priority: undefined,
      dueDate: '',
      description: '',
    });

    if (isOpen) {
      fetchTask();
    }
  }, [isOpen]);

  const onSubmit = async (data: TaskFormData) => {
    setLoading(true);

    const response = isUpdate
      ? await taskService.update({
        id: data.id,
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
      })
      : await taskService.create({
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
      });

    if (response.success) {
      showSnackbar(`Task ${isUpdate ? 'Updated' : 'Created'}`, 'success');
      onSuccess();
    } else {
      showSnackbar(response.errorMessage!, 'error');
    }

    setLoading(false);
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

    if (isUpdate) {
      setLoading(true);

      const response = await taskService.get(id);

      if (response.success) {
        reset({
          id: response.data?.id,
          name: response.data?.name,
          categoryId: response.data?.categoryId,
          status: response.data?.status,
          priority: response.data?.priority,
          dueDate: response.data?.dueDate
            ? new Date(response.data?.dueDate!).toLocaleDateString()
            : "",
          description: response.data?.description,
        });
      } else {
        showSnackbar(response.errorMessage!, 'error');
        onClose();
      }
    }

    setTimeout(() => setLoading(false), 500);
  };

  return (
    <Modal isOpen={isOpen} className={styles.modal}>
      <div className={styles.header}>
        <h2 className={styles.title}>{isUpdate ? "Update Task" : "Add a new Task"}</h2>
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
              required: 'Name is required',
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
              required: 'Category is required',
              valueAsNumber: true,
            })}
          />
          <TextArea
            id="description"
            label="Description"
            className='mb-4'
            disabled={loading}
            placeholder="Enter a description"
            error={errors.description?.message}
            rows={5}
            maxLength={100_000}
            registration={register('description', {
              maxLength: {
                value: 100_000,
                message: 'Description must be at most 100000 characters'
              },
            })}
          />
          <DateInput
            id="dueDate"
            label="Due Date"
            className='mb-4'
            disabled={loading}
            error={errors.dueDate?.message}
            onInvalidDate={(isValid: boolean) => {
              if (!isValid) {
                setError('dueDate', {
                  message: 'Invalid date'
                });
              } else {
                setError('dueDate', {
                  message: ''
                });
              }
            }}
            registration={register('dueDate')}
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
              required: 'Status is required',
              valueAsNumber: true,
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
              required: 'Priority is required',
              valueAsNumber: true,
            })}
          />
        </div>
      </form>
      <div className={styles.footer}>
        <Button disabled={loading} onClick={onClose} variant='secondary'>
          Cancel
        </Button>
        <Button loading={loading} onClick={handleSubmit(onSubmit)}>
          {isUpdate ? "Update" : "Create"}
        </Button>
      </div>
    </Modal>
  );
};

export default AddEditModal;
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useServices } from '../../../contexts/services/ServicesContext';
import { useSnackbar } from '../../../contexts/snackbar/SnackbarContext';
import Modal from '../../../components/modal/Modal';
import Button from '../../../components/button/Button';
import TextField from '../../../components/text-field/TextField';
import styles from './AddEditModal.module.css';

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  id?: number;
}

interface CategoryFormData {
  id: number;
  name: string;
}

const AddEditModal: React.FC<AddEditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  id,
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CategoryFormData>();
  const { categoryService } = useServices();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const isUpdate = !!id;

  useEffect(() => {
    reset({
      id: undefined,
      name: '',
    });

    fetchCategory();
  }, [isOpen]);

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);

    const response = isUpdate
      ? await categoryService.update({
        id: data.id,
        name: data.name,
      })
      : await categoryService.create({
        name: data.name,
      });

    if (response.success) {
      showSnackbar(`Category ${isUpdate ? 'Updated' : 'Created'}`, 'success');
      onSuccess();
    } else {
      showSnackbar(response.errorMessage!, 'error');
    }

    setLoading(false);
  };

  const fetchCategory = async () => {
    if (isUpdate) {
      setLoading(true);

      const response = await categoryService.get(id);

      if (response.success) {
        reset({
          id: response.data?.id,
          name: response.data?.name
        });
      } else {
        showSnackbar(response.errorMessage!, 'error');
        onClose();
      }

      setTimeout(() => setLoading(false), 500); 
    }
  };

  return (
    <Modal isOpen={isOpen} className={styles.modal}>
      <div className={styles.header}>
        <h2 className={styles.title}>{isUpdate ? "Update Category" : "Add a new Category"}</h2>
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
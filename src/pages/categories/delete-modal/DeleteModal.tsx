import React, { useState } from 'react';
import { useServices } from '../../../contexts/services/ServicesContext';
import { useSnackbar } from '../../../contexts/snackbar/SnackbarContext';
import { Category } from '../../../types/entities/Category';
import Modal from '../../../components/modal/Modal';
import Button from '../../../components/button/Button';
import styles from './DeleteModal.module.css';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item?: Category;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  item,
}) => {
  const { categoryService } = useServices();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!item) return;

    setLoading(true);
    const response = await categoryService.delete(item.id);

    if (response.success) {
      showSnackbar('Category deleted successfully', 'success');
      onSuccess();
    } else {
      showSnackbar(response.errorMessage!, 'error');
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} className={styles.modal}>
      <div className={styles.header}>
        <h2 className={styles.title}>Delete Category</h2>
      </div>
      <div className={styles.content}>
        <p>Do you want to delete the category <strong>{item?.name}</strong>?</p>
      </div>
      <div className={styles.footer}>
        <Button disabled={loading} onClick={onClose} variant='secondary'>
          Cancel
        </Button>
        <Button
          loading={loading}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
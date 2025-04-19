import React, { useState } from 'react';
import { useServices } from '../../../contexts/services/ServicesContext';
import { useSnackbar } from '../../../contexts/snackbar/SnackbarContext';
import { Task } from '../../../types/entities/Task';
import Modal from '../../../components/modal/Modal';
import Button from '../../../components/button/Button';
import styles from './DeleteModal.module.css';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item?: Task;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  item,
}) => {
  const { taskService } = useServices();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!item) return;

    setLoading(true);
    const response = await taskService.delete(item.id);

    if (response.success) {
      showSnackbar('Task deleted successfully', 'success');
      onSuccess();
    } else {
      showSnackbar(response.errorMessage!, 'error');
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} className={styles.modal}>
      <div className={styles.header}>
        <h2 className={styles.title}>Delete Task</h2>
      </div>
      <div className={styles.content}>
        <p>Do you want to delete the task <strong>{item?.name}</strong>?</p>
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
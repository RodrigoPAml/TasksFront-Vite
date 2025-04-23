import React, { useEffect, useState } from 'react';
import Table from '../../../components/table/Table';
import Button from '../../../components/button/Button';
import AddEditModal from '../add-edit-modal/AddEditModal';
import DeleteModal from '../delete-modal/DeleteModal';
import { Category } from '../../../types/entities/Category';
import { useSnackbar } from '../../../contexts/snackbar/SnackbarContext';
import { useServices } from '../../../contexts/services/ServicesContext';
import styles from './Categories.module.css';

const Categories: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  const { categoryService } = useServices();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [item, setItem] = useState<Category | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const categories = await categoryService.getAll();

    if (categories.success) {
      setItems(categories.data?.items!);
    } else {
      showSnackbar(categories.errorMessage!, 'error');
    }
    setTimeout(() => setLoading(false), 500);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <h1 className={styles.title}>Categories</h1>
        <Button
          title="Add"
          onClick={() => setIsModalOpen(true)} className={styles.addButton}>
          <svg height='1rem' fill='white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
          </svg>
        </Button>
      </div>
      <Table<Category>
        columns={[
          { key: 'id', header: 'Id', sortable: true, minSize: 80, size: 80 },
          { key: 'name', header: 'Name', sortable: true, minSize: 80, size: 200 },
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
                    setIsModalOpen(true);
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
                    setIsDeleteModalOpen(true)
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
        className="h-[calc(90vh-250px)] mt-4"
        data={items}
        loading={loading}
        withPagination
        pageSize={10}
        totalRows={items.length}
        mode='client'
      />
      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setItem(undefined);
        }}
        onSuccess={() => {
          setIsModalOpen(false);
          setItem(undefined);
          fetchCategories();
        }}
        id={item?.id}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItem(undefined);
        }}
        onSuccess={() => {
          setIsDeleteModalOpen(false);
          setItem(undefined);
          fetchCategories();
        }}
        item={item}
      />
    </div>
  );
};

export default Categories;
import React, { useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getSortedRowModel,
  SortingState,
  ColumnResizeMode,
  getPaginationRowModel,
  PaginationState,
} from '@tanstack/react-table';
import styles from './Table.module.css';

export interface Column<T> {
  key: string;
  header?: string;
  sortable?: boolean;
  minSize?: number;
  size?: number;
  maxSize?: number;
  cell?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  className?: string;
  withPagination?: boolean;
  pageSize?: number;
  onPaginationChange?: (pageNumber: number, pageSize: number, sortColumn: string, sortAsc?: boolean) => void;
  mode?: 'client' | 'server';
  totalRows?: number;
  refresh?: boolean;
}

const Table = <T extends object>({
  data,
  columns,
  loading = false,
  className,
  withPagination = false,
  pageSize = 10,
  onPaginationChange,
  mode = 'client',
  totalRows,
  refresh,
}: TableProps<T>
) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnResizeMode] = React.useState<ColumnResizeMode>('onChange');
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  useEffect(() => {
    if (withPagination) {
      setPagination({
        pageIndex: 0,
        pageSize: pageSize,
      });
    }
  }, [pageSize, withPagination]);

  useEffect(() => {
    if (withPagination) {
      const sortColumn = sorting.length > 0 ? sorting[0].id : '';
      const sortAsc = sorting.length === 0 ? undefined : !sorting[0].desc;
      onPaginationChange?.(pagination.pageIndex, pagination.pageSize, sortColumn, sortAsc);
    }
  }, [pagination.pageIndex, sorting, refresh]);

  const tableColumns: ColumnDef<T>[] = columns.map((col) => ({
    id: col.key.toString(),
    accessorFn: (row: any) => col.key in row ? row[col.key] : undefined,
    header: col.header,
    sortDescFirst: true,
    enableSorting: col.sortable ?? true,
    minSize: typeof col.minSize === 'number' ? col.minSize : undefined,
    size: typeof col.size === 'number' ? col.size : undefined,
    maxSize: typeof col.maxSize === 'number' ? col.maxSize : undefined,
    enableResizing: true,
    cell: ({ getValue, row }) => {
      const value = getValue();
      return col.cell ? col.cell(value, row.original) : value;
    },
  }));

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      pagination: withPagination ? pagination : undefined,
    },
    onSortingChange: setSorting,
    onPaginationChange: withPagination ? setPagination : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: mode === 'client' ? getSortedRowModel() : undefined,
    getPaginationRowModel: withPagination && mode === 'client' ? getPaginationRowModel() : undefined,
    pageCount: mode === 'server' && totalRows ? Math.ceil(totalRows / pageSize) : undefined,
    columnResizeMode,
    autoResetPageIndex: false,
    enableColumnResizing: true,
    defaultColumn: {
      size: 0,
      minSize: 0,
    },
  });

  return (
    <div className={`${styles.tableWrapper} ${className || ''}`}>
      <table
        className={`${styles.table} ${loading ? styles.tableLoading : ''}`}
        style={{ width: table.getCenterTotalSize() }}
      >
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <th
                  key={header.id}
                  className={styles.th}
                  colSpan={header.colSpan}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{
                    cursor: header.column.getCanSort() ? 'pointer' : 'default',
                    width: index === headerGroup.headers.length - 1 ? 'auto' : `${header.getSize()}px`,
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className={styles.sortIcon}>
                      {{
                        asc: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 384 512">
                          <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2 160 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
                        </svg>,
                        desc: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 384 512">
                          <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                        </svg>
                      }[header.column.getIsSorted() as string] ?? ''}
                    </span>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </div>
                  {index !== headerGroup.headers.length - 1 && (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={styles.resizer}
                    />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className='h-full'>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className={styles.loadingCell}>
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner} />
                </div>
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map(row => (
              <tr key={row.id} className={styles.tr}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className={styles.td}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {withPagination && !loading && (
        <div className={styles.pagination} style={{ width: table.getCenterTotalSize() }}>
          <button
            className={styles.paginationButton}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <span className={styles.paginationInfo}>
            Page{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {Math.max(1, table.getPageCount())}
            </strong>
          </span>
          <button
            className={styles.paginationButton}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
import { createContext, useContext, useState, useMemo } from 'react';

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type Table,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';

export type DataTableContextState = Table<unknown>;

export const DataTableContext = createContext<DataTableContextState | undefined>(undefined);

export function DataTableProvider<T>({ children, data, columns }: DataTableProviderProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  console.log('sorting', sorting)
  const table = useReactTable<unknown>({
    data,
    columns: columns as ColumnDef<unknown>[],
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  // since a table state change (sorting change)
  // doesn't cause tanstack table
  // to create a new table object
  // it has to be done manually
  // otherwise sub-components won't re-render on state change
  // which will break some table features (like sorting)
  const renderPatchTable = useMemo(() => {
    return { ...table };
  }, [table, sorting]);

  return (
    <DataTableContext.Provider value={renderPatchTable}>
      {children}
    </DataTableContext.Provider>
  );
}

export interface DataTableProviderProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  children?: React.ReactNode;
}

export const useDataTable = (): DataTableContextState => {
  const context = useContext(DataTableContext);

  if (!context) {
    throw new Error('Cannot use table outside of the TableProvider tree');
  }

  return context;
}

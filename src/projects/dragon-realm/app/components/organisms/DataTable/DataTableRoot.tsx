import { Table } from '~/components/molecules/Table';

import { DataTableProvider, type DataTableProviderProps } from './context';

export function DataTableRoot<T>({ children, ...rest }: DataTableRootProps<T>) {
  return (
    <DataTableProvider {...rest}>
      {children}
    </DataTableProvider>
  );
}

export interface DataTableRootProps<T> extends DataTableProviderProps<T> {

}

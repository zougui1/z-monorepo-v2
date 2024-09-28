import { DataTableRoot, type DataTableRootProps } from './DataTableRoot';
import { DataTableContent, type DataTableContentProps } from './DataTableContent';
import { DataTableHeader, type DataTableHeaderProps } from './DataTableHeader';
import { DataTableBody, type DataTableBodyProps } from './DataTableBody';
import { DataTablePagination, type DataTablePaginationProps } from './DataTablePagination';

export const DataTable = {
  Root: DataTableRoot,
  Content: DataTableContent,
  Header: DataTableHeader,
  Body: DataTableBody,
  Pagination: DataTablePagination,
};

export type {
  DataTableRootProps as TableRootProps,
  DataTableContentProps as TableContentProps,
  DataTableHeaderProps as TableHeaderProps,
  DataTableBodyProps as TableBodyProps,
  DataTablePaginationProps as TablePaginationProps,
};

export * from './utils';

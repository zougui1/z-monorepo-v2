import { flexRender } from '@tanstack/react-table';

import { Button } from '~/components/atoms/Button';

import { useDataTable } from './context';

export const DataTablePagination = () => {
  const table = useDataTable();

  return (
    <div className="flex items-center py-4">
      <div className="flex-1 text-sm text-muted-foreground space-x-2">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount().toLocaleString()}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export interface DataTablePaginationProps {
  children?: React.ReactNode;
}

import type { ColumnDef } from '@tanstack/react-table';

import { Typography } from '~/components/atoms/Typography';
import { DataTable } from '~/components/organisms/DataTable';
import { cn } from '~/utils';

export function GameDataDialogTable<T>({ className, title, data, columns, ...rest }: GameDataDialogTableProps<T>) {
  return (
    <div {...rest} className={cn('flex flex-col space-y-6', className)}>
      {title && (
        <Typography variant="h2" className="w-full text-center">
          {title}
        </Typography>
      )}

      <DataTable.Root data={data} columns={columns}>
        <DataTable.Content>
          <DataTable.Header />
          <DataTable.Body />
        </DataTable.Content>

        <DataTable.Pagination />
      </DataTable.Root>
    </div>
  );
};

export interface GameDataDialogTableProps<T> extends Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'children' | 'title'> {
  data: T[];
  columns: ColumnDef<T>[];
  title?: React.ReactNode;
}

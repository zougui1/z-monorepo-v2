import { flexRender } from '@tanstack/react-table';

import { Table } from '~/components/molecules/Table';

import { useDataTable } from './context';

export const DataTableBody = () => {
  const table = useDataTable();

  const { rows } = table.getRowModel();
  console.log('rows: render')

  if (!rows.length) {
    return (
      <Table.Body>
        <Table.Row>
          <Table.Cell
            colSpan={table.getAllColumns().length}
            className="h-24 text-center"
          >
            No results.
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  }

  return (
    <Table.Body>
      {rows.map((row) => (
        <Table.Row key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <Table.Cell key={cell.id}>
              {flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
              )}
            </Table.Cell>
          ))}
        </Table.Row>
      ))}
    </Table.Body>
  );
}

export interface DataTableBodyProps {
  children?: React.ReactNode;
}

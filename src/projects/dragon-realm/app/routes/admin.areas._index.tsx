import { Link, useLoaderData } from '@remix-run/react';
import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Button } from '~/components/atoms/Button';
import { Dropdown } from '~/components/molecules/Dropdown';
import { DataTable, getCellValue, getCellArrayLength, createSortedHead } from '~/components/organisms/DataTable';

import { Typography } from '~/components/atoms/Typography';
import { DB } from '~/database';
import type { MinimalAreaObject } from '~/database/Area';

const columns: ColumnDef<MinimalAreaObject>[] = [
  {
    accessorKey: 'id',
    header: createSortedHead('ID'),
    cell: getCellValue,
  },
  {
    accessorKey: 'name',
    header: createSortedHead('Name'),
    cell: getCellValue,
  },
  {
    accessorKey: 'exits',
    header: createSortedHead('Exits'),
    cell: getCellArrayLength,
  },
  {
    accessorKey: 'locations',
    header: createSortedHead('Locations'),
    cell: getCellArrayLength,
  },
  {
    id: 'actions',
    header: () => {
      return (
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 ml-3.5">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </Dropdown.Trigger>

          <Dropdown.Content align="end">
            <Dropdown.Item asChild>
              <Link to="/admin/areas/new">
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>Create new area</span>
              </Link>
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      );
    },
    cell: ({ row }) => {
      const area = row.original;

      return (
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </Dropdown.Trigger>

          <Dropdown.Content>
            <Dropdown.Item asChild>
              <Link to={`/admin/areas/${area._id}`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>View area</span>
              </Link>
            </Dropdown.Item>

            <Dropdown.Item
              onClick={() => console.log('delete area', area._id)}
            >
              <Trash2 className="mr-2 h-4 w-4 text-red-600" />
              <span>Delete area</span>
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      );
    },
  },
];

export const loader = async () => {
  return DB.area.findAll();
}

export default function Areas() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="w-full flex flex-col items-center space--6">
      <Typography variant="h1" className="pb-6">Areas</Typography>

      <DataTable.Root data={data} columns={columns}>
        <DataTable.Content>
          <DataTable.Header />
          <DataTable.Body />
        </DataTable.Content>

        <DataTable.Pagination />
      </DataTable.Root>
    </div>
  );
}

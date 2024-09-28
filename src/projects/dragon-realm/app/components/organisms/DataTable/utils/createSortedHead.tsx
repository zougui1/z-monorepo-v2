import { ArrowUpDown } from 'lucide-react';
import type { HeaderContext } from '@tanstack/react-table';

import { Button } from '~/components/atoms/Button';

export const createSortedHead = (label: string) => {
  const SortedHead = ({ column }: HeaderContext<any, unknown>) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {label}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    );
  }

  return SortedHead;
}

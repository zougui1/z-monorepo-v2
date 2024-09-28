import { Table } from '~/components/molecules/Table';

export const DataTableContent = ({ children }: DataTableContentProps) => {
  return (
    <Table.Root>
      {children}
    </Table.Root>
  );
}

export interface DataTableContentProps {
  children?: React.ReactNode;
}

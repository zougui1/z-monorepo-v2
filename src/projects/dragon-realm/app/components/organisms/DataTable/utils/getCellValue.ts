import type { CellContext } from '@tanstack/react-table';

export const getCellValue = (info: CellContext<any, unknown>): string | number => {
  return String(info.getValue());
}

import type { CellContext } from '@tanstack/react-table';

export const getCellArrayLength = (info: CellContext<any, unknown>): string | number => {
  const data = info.getValue();
  return Array.isArray(data) ? data.length : 0;
}

export const getUnit = (size: string): 'px' | '%' | 'ratio' => {
  if (size?.endsWith('px')) {
    return 'px';
  }

  if (size?.endsWith('%')) {
    return '%';
  }

  return 'ratio';
}

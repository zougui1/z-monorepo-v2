export const matrix = (options: MatrixOptions): string => {
  const { scale, translateX, translateY } = options;
  return `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;
}

export interface MatrixOptions {
  scale: number;
  translateX: number;
  translateY: number;
}

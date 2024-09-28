/**
 * Calculates the maximum zoom level for fitting all elements within the canvas.
 * @param canvasWidth - The width of the canvas.
 * @param canvasHeight - The height of the canvas.
 * @param x1 - The minimum x-coordinate of the elements.
 * @param y1 - The minimum y-coordinate of the elements.
 * @param x2 - The maximum x-coordinate of the elements.
 * @param y2 - The maximum y-coordinate of the elements.
 * @returns The maximum zoom level to fit all elements within the canvas.
 */
export const calculateMaxZoomLevel = (
  canvasWidth: number,
  canvasHeight: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  // Calculate the width and height of the bounding box
  const boundingBoxWidth = Math.abs(x2 - x1);
  const boundingBoxHeight = Math.abs(y2 - y1);

  // Calculate the scale factors to fit the bounding box within the canvas
  const scaleX = canvasWidth / boundingBoxWidth;
  const scaleY = canvasHeight / boundingBoxHeight;

  // The maximum zoom level is the smaller of the two scale factors
  return Math.min(scaleX, scaleY);
}

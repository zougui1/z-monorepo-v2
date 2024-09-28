export const pointInBox = (px: number, py: number, x: number, y: number, width: number, height: number): boolean => {
  // the origin of the box is centered
  x -= width / 2;
  y -= height / 2;

  // Calculate the boundaries of the square
  const squareLeft = x;
  const squareRight = x + width;
  const squareTop = y;
  const squareBottom = y + height;

  // Check if the point is within the square's boundaries
  if (px >= squareLeft && px <= squareRight && py >= squareTop && py <= squareBottom) {
    return true;
  }

  return false;
}

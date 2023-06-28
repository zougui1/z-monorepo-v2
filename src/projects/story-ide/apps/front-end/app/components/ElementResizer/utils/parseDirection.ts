import { Position, Direction } from '../enums';

export const parseDirection = (direction: Direction): Position[] => {
  switch (direction) {
    case Direction.Top:
    case Direction.Left:
    case Direction.Bottom:
    case Direction.Right:
      return [Position[direction]];

    case Direction.TopLeft:
      return [Position.Top, Position.Left];
    case Direction.TopRight:
      return [Position.Top, Position.Right];

    case Direction.BottomLeft:
      return [Position.Bottom, Position.Left];
    case Direction.BottomRight:
      return [Position.Bottom, Position.Right];

    default:
      console.warn(`Invalid direction "${direction}"`);
      return [];
  }
}

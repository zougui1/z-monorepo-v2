const reTimestampLike = /^(([0-9]{1,2}:)?[0-9]{1,2}:)?[0-9]{1,2}(.[0-9]+)?$/;

export namespace VideoTimestamp {
  export const isTimestampLike = (value: string): value is TimestampLikeType => {
    return reTimestampLike.test(value);
  }

  export function getValid(value: TimestampLikeType): Type;
  export function getValid(value: string): Type | undefined;
  export function getValid(value: TimestampLikeType | string): Type | undefined;
  export function getValid(value: TimestampLikeType | string): Type | undefined {
    if (!isTimestampLike(value)) {
      return
    }

    const parts = value.split(':').slice(0, 3);

    const timestamps = {
      1: {
        hours: '00',
        minutes: '00',
        seconds: parts[0]?.padStart(2, '0'),
      },
      2: {
        hours: '00',
        minutes: parts[0]?.padStart(2, '0'),
        seconds: parts[1]?.padStart(2, '0'),
      },
      3: {
        hours: parts[0]?.padStart(2, '0'),
        minutes: parts[1]?.padStart(2, '0'),
        seconds: parts[2]?.padStart(2, '0'),
      },
    };

    const { hours, minutes, seconds } = timestamps[parts.length as (1 | 2 | 3)] || timestamps[3];

    return `${hours}:${minutes}:${seconds}`;
  }

  export const fromSeconds = (seconds: number): Type => {
    // Calculate hours, minutes, and remaining seconds
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    // Ensure that each component has at least two digits
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    // Combine the components into the desired format
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  export function toSeconds(timestamp: TimestampLikeType): number;
  export function toSeconds(timestamp: string): number | undefined;
  export function toSeconds(timestamp: TimestampLikeType | string): number | undefined;
  export function toSeconds(timestamp: TimestampLikeType | string): number | undefined {
    const [hours, minutes, seconds] = getValid(timestamp)?.split(':').map(Number) || [];

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      return;
    }

    return hours * 3600 + minutes * 60 + seconds;
  };

  export type TimestampLikeType = `${number}` | `${number}:${number}` | `${number}:${number}:${number}` | Type;
  export type Type = `${string}:${string}:${string}`;
}

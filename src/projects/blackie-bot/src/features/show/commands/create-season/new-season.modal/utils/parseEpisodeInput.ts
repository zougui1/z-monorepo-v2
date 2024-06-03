import { isNumber } from 'radash';

export const parseEpisodeInput = (episodeInput: string): number[] => {
  return episodeInput
    .split(' ')
    .filter(Boolean)
    .flatMap(durationInput => {
      const [durationStr, multiplierStr] = durationInput.split('*');

      const duration = Number(durationStr);
      const multiplier = Number(multiplierStr);

      if (!isNumber(duration)) {
        throw new Error('Invalid episode input');
      }

      if (multiplierStr) {
        if (!isNumber(multiplier)) {
          throw new Error('Invalid episode input');
        }

        return new Array(multiplier).fill(duration);
      }

      return duration;
    });
}

import { Furaffinity, FuraffinityOptions } from './Furaffinity';
import { Submission } from './submission';

describe('Furaffinity', () => {
  describe('constructor', () => {
    it('should construct the object', () => {
      const options: FuraffinityOptions = {
        cookieA: 'eiosdfhysehfu',
        cookieB: 'oersikgosje',
      };

      const furaffinity = new Furaffinity(options);

      expect(furaffinity.submission).toBeInstanceOf(Submission);
    });
  });
});

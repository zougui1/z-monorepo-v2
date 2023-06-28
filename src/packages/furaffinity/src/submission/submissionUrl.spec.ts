import { submissionUrl } from './submissionUrl';

describe('submissionUrl', () => {
  describe('parse', () => {
    it('should parse the URL when it is valid', () => {
      expect(submissionUrl.parse('http://furaffinity.net/view/69')).toEqual({
        params: { id: 69 },
        query: {},
      });
      expect(submissionUrl.parse('https://furaffinity.net/view/69')).toEqual({
        params: { id: 69 },
        query: {},
      });
      expect(submissionUrl.parse('http://www.furaffinity.net/view/69')).toEqual({
        params: { id: 69 },
        query: {},
      });
      expect(submissionUrl.parse('https://www.furaffinity.net/view/69')).toEqual({
        params: { id: 69 },
        query: {},
      });
    });

    it('should throw an error when trying to parse an invalid URL', () => {
      expect(() => submissionUrl.parse('ws://furaffinity.net/view/69')).toThrowError();
      expect(() => submissionUrl.parse('https://furaffinity.com/view/69')).toThrowError();
      expect(() => submissionUrl.parse('https://furaffinity.com/user/69')).toThrowError();
      expect(() => submissionUrl.parse('https://furaffinity.com/view/zougui')).toThrowError();
    });
  });

  describe('validate', () => {
    it('should return true when the URL is valid', () => {
      expect(submissionUrl.validate('http://furaffinity.net/view/69')).toBe(true);
      expect(submissionUrl.validate('https://furaffinity.net/view/69')).toBe(true);
      expect(submissionUrl.validate('http://www.furaffinity.net/view/69')).toBe(true);
      expect(submissionUrl.validate('https://www.furaffinity.net/view/69')).toBe(true);
    });

    it('should return false when the URL is invalid', () => {
      expect(submissionUrl.validate('ws://furaffinity.net/view/69')).toBe(false);
      expect(submissionUrl.validate('https://furaffinity.com/view/69')).toBe(false);
      expect(submissionUrl.validate('https://furaffinity.com/user/69')).toBe(false);
      expect(submissionUrl.validate('https://furaffinity.com/view/zougui')).toBe(false);
    });
  });

  describe('create', () => {
    it('should create the URL with valid parameters', () => {
      const result = submissionUrl.create({
        params: { id: 69 },
        query: {},
      });

      expect(result).toBe('https://furaffinity.net/view/69');
    });

    it('should throw an error when the parameters are invalid', () => {
      const getResult = () => submissionUrl.create({
        // @ts-expect-error
        params: { id: 'Zougui' },
        query: {},
      });

      expect(getResult).toThrowError();
    });

    it('should throw an error when the parameters are missing', () => {
      const getResult = () => submissionUrl.create({
        // @ts-expect-error
        params: {},
        query: {},
      });

      expect(getResult).toThrowError();
    });
  });
});

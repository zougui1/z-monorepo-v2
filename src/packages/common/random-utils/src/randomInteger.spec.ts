import { randomInteger } from './randomInteger';

describe('randomInteger', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an integer at min', () => {
    const min = 42;
    const max = 69;

    jest.spyOn(Math, 'random').mockReturnValue(0);

    const result = randomInteger(min, max);

    expect(result).toBe(min);
  });

  it('should return an integer at max', () => {
    const min = 42;
    const max = 69;

    jest.spyOn(Math, 'random').mockReturnValue(0.99999999999999999);

    const result = randomInteger(min, max);

    expect(result).toBe(max);
  });

  it('should return an integer between the min and max', () => {
    const min = 42;
    const max = 69;

    jest.spyOn(Math, 'random').mockReturnValue(0.69);

    const result = randomInteger(min, max);

    expect(result).toBe(61);
  });
});

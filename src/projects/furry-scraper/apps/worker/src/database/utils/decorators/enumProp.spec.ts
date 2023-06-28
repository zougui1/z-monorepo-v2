import { enumProp } from './enumProp';

const mocks = {
  prop: jest.fn(),
};

jest.mock('@typegoose/typegoose', () => {
  return {
    prop: (...args: any[]) => mocks.prop(...args),
  };
});

describe('enumProp', () => {
  afterEach(() => {
    mocks.prop.mockReset();
    jest.clearAllMocks();
  });

  it('should throw an error when the enum has no values', () => {
    const enumerate = {};
    const getResult = () => enumProp({ enum: enumerate });

    expect(getResult).toThrowError();
  });

  it('should return a prop decorator for the enum', () => {
    const enumerate = {
      dragon: 'dragon',
    };

    mocks.prop.mockReturnValue('the decorator');

    const result = enumProp({ enum: enumerate });

    expect(result).toBe('the decorator');
    expect(mocks.prop).toBeCalledWith(
      {
        type: expect.any(Function),
        enum: Object.values(enumerate),
      },
      undefined,
    );
    expect(mocks.prop.mock.calls[0][0].type()).toEqual(String);
  });

  it('should return a prop decorator for the enum as an array', () => {
    const enumerate = {
      dragon: 'dragon',
    };

    mocks.prop.mockReturnValue('the decorator');

    const result = enumProp({ enum: enumerate, array: true });

    expect(result).toBe('the decorator');
    expect(mocks.prop).toBeCalledWith(
      {
        type: expect.any(Function),
        enum: Object.values(enumerate),
      },
      undefined,
    );
    expect(mocks.prop.mock.calls[0][0].type()).toEqual([String]);
  });
});

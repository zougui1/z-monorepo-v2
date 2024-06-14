import { mapObject } from './mapObject';

describe('mapObject', () => {
  it('should return a new object with new values and same keys', () => {
    const obj = {
      myVal: 42,
      myNumber: 69,
    };

    const result = mapObject(obj, value => value * 2);

    expect(result).toEqual({
      myVal: obj.myVal * 2,
      myNumber: obj.myNumber * 2,
    });
  });
});

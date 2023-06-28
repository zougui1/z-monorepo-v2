import { pickFieldsFromResolvedObject } from './pickFieldsFromResolvedObject';

describe('pickFieldsFromResolvedObject', () => {
  it('should not call the function and return an empty object when there is no fields', async () => {
    const func = jest.fn().mockImplementation(async () => ({}));
    const requiredFields = ['dragon', 'wolf'];
    const fields = undefined;

    const result = await pickFieldsFromResolvedObject(func, requiredFields, fields);

    expect(result).toEqual({});
    expect(func).not.toBeCalled();
  });

  it('should not call the function and return an empty object when the fields do not include any of the required fields', async () => {
    const func = jest.fn().mockImplementation(async () => ({}));
    const requiredFields = ['dragon', 'wolf'];
    const fields = ['dog'];

    const result = await pickFieldsFromResolvedObject(func, requiredFields, fields);

    expect(result).toEqual({});
    expect(func).not.toBeCalled();
  });

  it('should pick fields from the returned object when any of the required fields are selected', async () => {
    const func = async () => ({
      dragon: 'sexy',
      wolf: 'nice',
    });
    const requiredFields: ('dragon' | 'wolf')[] = ['dragon', 'wolf'];
    const fields: ('dragon')[] = ['dragon'];

    const result = await pickFieldsFromResolvedObject(func, requiredFields, fields);

    expect(result).toEqual({
      dragon: 'sexy',
    });
  });
});

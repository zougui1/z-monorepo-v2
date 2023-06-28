import { getConstraintValue } from './getConstraintValue';

describe('getConstraintValue', () => {
  describe('when constraint is not a number', () => {
    describe('when the original value is a number and greater than the default value', () => {
      it('should return the default value when the constraint is undefined', () => {
        const constraint = undefined;
        const original = 100;
        const defaultValue = 69;

        const result = getConstraintValue(constraint, original, defaultValue);

        expect(result).toBe(defaultValue);
      });

      it('should return the default value when the constraint is NaN', () => {
        const constraint = NaN;
        const original = 100;
        const defaultValue = 69;

        const result = getConstraintValue(constraint, original, defaultValue);

        expect(result).toBe(defaultValue);
      });
    });

    describe('when the original value is undefined', () => {
      it('should return the default value when the constraint is undefined', () => {
        const constraint = undefined;
        const original = undefined;
        const defaultValue = 69;

        const result = getConstraintValue(constraint, original, defaultValue);

        expect(result).toBe(defaultValue);
      });

      it('should return the default value when the constraint is NaN', () => {
        const constraint = NaN;
        const original = undefined;
        const defaultValue = 69;

        const result = getConstraintValue(constraint, original, defaultValue);

        expect(result).toBe(defaultValue);
      });
    });

    describe('when the original value is NaN', () => {
      it('should return the default value when the constraint is undefined', () => {
        const constraint = undefined;
        const original = NaN;
        const defaultValue = 69;

        const result = getConstraintValue(constraint, original, defaultValue);

        expect(result).toBe(defaultValue);
      });

      it('should return the default value when the constraint is NaN', () => {
        const constraint = NaN;
        const original = NaN;
        const defaultValue = 69;

        const result = getConstraintValue(constraint, original, defaultValue);

        expect(result).toBe(defaultValue);
      });
    });
  });

  describe('when constraint is a number', () => {
    it('should return the original value when it is less than the constraint', () => {
      const constraint = 82;
      const original = 42;
      const defaultValue = 69;

      const result = getConstraintValue(constraint, original, defaultValue);

      expect(result).toBe(original);
    });

    it('should return the constraint value when it is less than the original value', () => {
      const constraint = 26;
      const original = 42;
      const defaultValue = 69;

      const result = getConstraintValue(constraint, original, defaultValue);

      expect(result).toBe(constraint);
    });

    it('should return the constraint when the original value is undefined', () => {
      const constraint = 82;
      const original = undefined;
      const defaultValue = 69;

      const result = getConstraintValue(constraint, original, defaultValue);

      expect(result).toBe(constraint);
    });

    it('should return the constraint when the original value is NaN', () => {
      const constraint = 82;
      const original = NaN;
      const defaultValue = 69;

      const result = getConstraintValue(constraint, original, defaultValue);

      expect(result).toBe(constraint);
    });
  });
});

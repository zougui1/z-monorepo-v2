import { MS } from './MS';

describe('MS.parse', () => {
  const maxLength = 100;

  describe('invalid input', () => {
    it('should throw an error when the string is too long', () => {
      const string = '9'.repeat(maxLength + 1);
      expect(() => MS.parse(string)).toThrowError(/value exceeds the maximum length/i);
    });

    it('should throw an error when the string is invalid', () => {
      expect(() => MS.parse('toto')).toThrowError(/invalid/i);
    });
  });

  describe('short string', () => {
    it('should preserve ms', () => {
      expect(MS.parse('100')).toBe(100);
    });

    it('should convert from m to ms', () => {
      expect(MS.parse('1m')).toBe(60000);
    });

    it('should convert from h to ms', () => {
      expect(MS.parse('1h')).toBe(3600000);
    });

    it('should convert d to ms', () => {
      expect(MS.parse('2d')).toBe(172800000);
    });

    it('should convert w to ms', () => {
      expect(MS.parse('3w')).toBe(1814400000);
    });

    it('should convert s to ms', () => {
      expect(MS.parse('1s')).toBe(1000);
    });

    it('should convert ms to ms', () => {
      expect(MS.parse('100ms')).toBe(100);
    });

    it('should convert y to ms', () => {
      expect(MS.parse('1y')).toBe(31557600000);
    });

    it('should work with decimals', () => {
      expect(MS.parse('1.5h')).toBe(5400000);
    });

    it('should work with multiple spaces', () => {
      expect(MS.parse('1   s')).toBe(1000);
    });

    it('should be case-insensitive', () => {
      expect(MS.parse('1.5H')).toBe(5400000);
    });

    it('should work with numbers starting with .', () => {
      expect(MS.parse('.5ms')).toBe(0.5);
    });

    it('should work with negative integers', () => {
      expect(MS.parse('-100ms')).toBe(-100);
    });

    it('should work with negative decimals', () => {
      expect(MS.parse('-1.5h')).toBe(-5400000);
      expect(MS.parse('-10.5h')).toBe(-37800000);
    });

    it('should work with negative decimals starting with "."', () => {
      expect(MS.parse('-.5h')).toBe(-1800000);
    });
  });

  describe('long string', () => {
    it('should convert milliseconds to ms', () => {
      expect(MS.parse('53 milliseconds')).toBe(53);
    });

    it('should convert msecs to ms', () => {
      expect(MS.parse('17 msecs')).toBe(17);
    });

    it('should convert sec to ms', () => {
      expect(MS.parse('1 sec')).toBe(1000);
    });

    it('should convert from min to ms', () => {
      expect(MS.parse('1 min')).toBe(60000);
    });

    it('should convert from hr to ms', () => {
      expect(MS.parse('1 hr')).toBe(3600000);
    });

    it('should convert days to ms', () => {
      expect(MS.parse('2 days')).toBe(172800000);
    });

    it('should convert weeks to ms', () => {
      expect(MS.parse('1 week')).toBe(604800000);
    });

    it('should convert years to ms', () => {
      expect(MS.parse('1 year')).toBe(31557600000);
    });

    it('should work with decimals', () => {
      expect(MS.parse('1.5 hours')).toBe(5400000);
    });

    it('should work with negative integers', () => {
      expect(MS.parse('-100 milliseconds')).toBe(-100);
    });

    it('should work with negative decimals', () => {
      expect(MS.parse('-1.5 hours')).toBe(-5400000);
    });

    it('should work with negative decimals starting with "."', () => {
      expect(MS.parse('-.5 hr')).toBe(-1800000);
    });
  });
});

describe('MS.toString', () => {
  describe('invalid inputs', () => {
    it('should throw an error when the value is Infinity', () => {
      expect(() => MS.toString(Infinity)).toThrowError();
    });

    it('should throw an error when the value is -Infinity', () => {
      expect(() => MS.toString(-Infinity)).toThrowError();
    });

    it('should throw an error when the value is NaN', () => {
      expect(() => MS.toString(NaN)).toThrowError();
    });

    it('should throw an error when the value is a string', () => {
      // @ts-expect-error - We expect this to throw.
      expect(() => MS.toString('')).toThrowError();
    });

    it('should throw an error when the value is a string with more than 100 characters', () => {
      // @ts-expect-error - We expect this to throw.
      expect(() => MS.toString('1'.repeat(101))).toThrowError();
    });

    it('should throw an error when the value is undefined', () => {
      // @ts-expect-error - We expect this to throw.
      expect(() => MS.toString(undefined)).toThrowError();
    });

    it('should throw an error when the value is null', () => {
      // @ts-expect-error - We expect this to throw.
      expect(() => MS.toString(null)).toThrowError();
    });

    it('should throw an error when the value is an array', () => {
      // @ts-expect-error - We expect this to throw.
      expect(() => MS.toString([])).toThrowError();
    });

    it('should throw an error when the value is an object', () => {
      // @ts-expect-error - We expect this to throw.
      expect(() => MS.toString({})).toThrowError();
    });
  });

  describe('default format = short', () => {
    it('should support milliseconds', () => {
      expect(MS.toString(500)).toBe('500ms');

      expect(MS.toString(-500)).toBe('-500ms');
    });

    it('should support seconds', () => {
      expect(MS.toString(1000)).toBe('1s');
      expect(MS.toString(10000)).toBe('10s');

      expect(MS.toString(-1000)).toBe('-1s');
      expect(MS.toString(-10000)).toBe('-10s');
    });

    it('should support minutes', () => {
      expect(MS.toString(60 * 1000)).toBe('1m');
      expect(MS.toString(60 * 10000)).toBe('10m');

      expect(MS.toString(-1 * 60 * 1000)).toBe('-1m');
      expect(MS.toString(-1 * 60 * 10000)).toBe('-10m');
    });

    it('should support hours', () => {
      expect(MS.toString(60 * 60 * 1000)).toBe('1h');
      expect(MS.toString(60 * 60 * 10000)).toBe('10h');

      expect(MS.toString(-1 * 60 * 60 * 1000)).toBe('-1h');
      expect(MS.toString(-1 * 60 * 60 * 10000)).toBe('-10h');
    });

    it('should support days', () => {
      expect(MS.toString(24 * 60 * 60 * 1000)).toBe('1d');
      expect(MS.toString(24 * 60 * 60 * 10000)).toBe('10d');

      expect(MS.toString(-1 * 24 * 60 * 60 * 1000)).toBe('-1d');
      expect(MS.toString(-1 * 24 * 60 * 60 * 10000)).toBe('-10d');
    });

    it('should round', () => {
      expect(MS.toString(234234234)).toBe('3d');

      expect(MS.toString(-234234234)).toBe('-3d');
    });
  });

  describe('invalid format = short format', () => {
    const format = 'haha' as MS.DurationFormat;

    it('should support milliseconds', () => {
      expect(MS.toString(500, { format })).toBe('500ms');

      expect(MS.toString(-500, { format })).toBe('-500ms');
    });

    it('should support seconds', () => {
      expect(MS.toString(1000, { format })).toBe('1s');
      expect(MS.toString(10000, { format })).toBe('10s');

      expect(MS.toString(-1000, { format })).toBe('-1s');
      expect(MS.toString(-10000, { format })).toBe('-10s');
    });

    it('should support minutes', () => {
      expect(MS.toString(60 * 1000, { format })).toBe('1m');
      expect(MS.toString(60 * 10000, { format })).toBe('10m');

      expect(MS.toString(-1 * 60 * 1000, { format })).toBe('-1m');
      expect(MS.toString(-1 * 60 * 10000, { format })).toBe('-10m');
    });

    it('should support hours', () => {
      expect(MS.toString(60 * 60 * 1000, { format })).toBe('1h');
      expect(MS.toString(60 * 60 * 10000, { format })).toBe('10h');

      expect(MS.toString(-1 * 60 * 60 * 1000, { format })).toBe('-1h');
      expect(MS.toString(-1 * 60 * 60 * 10000, { format })).toBe('-10h');
    });

    it('should support days', () => {
      expect(MS.toString(24 * 60 * 60 * 1000, { format })).toBe('1d');
      expect(MS.toString(24 * 60 * 60 * 10000, { format })).toBe('10d');

      expect(MS.toString(-1 * 24 * 60 * 60 * 1000, { format })).toBe('-1d');
      expect(MS.toString(-1 * 24 * 60 * 60 * 10000, { format })).toBe('-10d');
    });

    it('should round', () => {
      expect(MS.toString(234234234, { format })).toBe('3d');

      expect(MS.toString(-234234234, { format })).toBe('-3d');
    });
  });

  describe('short format', () => {
    const format: MS.DurationFormat = 'short';

    it('should support milliseconds', () => {
      expect(MS.toString(500, { format })).toBe('500ms');

      expect(MS.toString(-500, { format })).toBe('-500ms');
    });

    it('should support seconds', () => {
      expect(MS.toString(1000, { format })).toBe('1s');
      expect(MS.toString(10000, { format })).toBe('10s');

      expect(MS.toString(-1000, { format })).toBe('-1s');
      expect(MS.toString(-10000, { format })).toBe('-10s');
    });

    it('should support minutes', () => {
      expect(MS.toString(60 * 1000, { format })).toBe('1m');
      expect(MS.toString(60 * 10000, { format })).toBe('10m');

      expect(MS.toString(-1 * 60 * 1000, { format })).toBe('-1m');
      expect(MS.toString(-1 * 60 * 10000, { format })).toBe('-10m');
    });

    it('should support hours', () => {
      expect(MS.toString(60 * 60 * 1000, { format })).toBe('1h');
      expect(MS.toString(60 * 60 * 10000, { format })).toBe('10h');

      expect(MS.toString(-1 * 60 * 60 * 1000, { format })).toBe('-1h');
      expect(MS.toString(-1 * 60 * 60 * 10000, { format })).toBe('-10h');
    });

    it('should support days', () => {
      expect(MS.toString(24 * 60 * 60 * 1000, { format })).toBe('1d');
      expect(MS.toString(24 * 60 * 60 * 10000, { format })).toBe('10d');

      expect(MS.toString(-1 * 24 * 60 * 60 * 1000, { format })).toBe('-1d');
      expect(MS.toString(-1 * 24 * 60 * 60 * 10000, { format })).toBe('-10d');
    });

    it('should round', () => {
      expect(MS.toString(234234234, { format })).toBe('3d');

      expect(MS.toString(-234234234, { format })).toBe('-3d');
    });
  });

  describe('long format', () => {
    const format: MS.DurationFormat = 'long';

    it('should support milliseconds', () => {
      expect(MS.toString(500, { format })).toBe('500 ms');

      expect(MS.toString(-500, { format })).toBe('-500 ms');
    });

    it('should support seconds', () => {
      expect(MS.toString(1000, { format })).toBe('1 second');
      expect(MS.toString(10000, { format })).toBe('10 seconds');

      expect(MS.toString(-1000, { format })).toBe('-1 second');
      expect(MS.toString(-10000, { format })).toBe('-10 seconds');
    });

    it('should support minutes', () => {
      expect(MS.toString(60 * 1000, { format })).toBe('1 minute');
      expect(MS.toString(60 * 10000, { format })).toBe('10 minutes');

      expect(MS.toString(-1 * 60 * 1000, { format })).toBe('-1 minute');
      expect(MS.toString(-1 * 60 * 10000, { format })).toBe('-10 minutes');
    });

    it('should support hours', () => {
      expect(MS.toString(60 * 60 * 1000, { format })).toBe('1 hour');
      expect(MS.toString(60 * 60 * 10000, { format })).toBe('10 hours');

      expect(MS.toString(-1 * 60 * 60 * 1000, { format })).toBe('-1 hour');
      expect(MS.toString(-1 * 60 * 60 * 10000, { format })).toBe('-10 hours');
    });

    it('should support days', () => {
      expect(MS.toString(24 * 60 * 60 * 1000, { format })).toBe('1 day');
      expect(MS.toString(24 * 60 * 60 * 10000, { format })).toBe('10 days');

      expect(MS.toString(-1 * 24 * 60 * 60 * 1000, { format })).toBe('-1 day');
      expect(MS.toString(-1 * 24 * 60 * 60 * 10000, { format })).toBe('-10 days');
    });

    it('should round', () => {
      expect(MS.toString(234234234, { format })).toBe('3 days');

      expect(MS.toString(-234234234, { format })).toBe('-3 days');
    });
  });

  describe('verbose format', () => {
    const format: MS.DurationFormat = 'verbose';

    it('should support milliseconds', () => {
      expect(MS.toString(500, { format })).toBe('500 milliseconds');

      expect(MS.toString(-500, { format })).toBe('-500 milliseconds');
    });

    it('should support seconds', () => {
      expect(MS.toString(1000, { format })).toBe('1 seconds');
      expect(MS.toString(10000, { format })).toBe('10 seconds');

      expect(MS.toString(-1000, { format })).toBe('-1 seconds');
      expect(MS.toString(-10000, { format })).toBe('-10 seconds');
    });

    it('should support minutes', () => {
      expect(MS.toString(60 * 1000, { format })).toBe('1 minutes');
      expect(MS.toString(60 * 10000, { format })).toBe('10 minutes');

      expect(MS.toString(-1 * 60 * 1000, { format })).toBe('-1 minutes');
      expect(MS.toString(-1 * 60 * 10000, { format })).toBe('-10 minutes');
    });

    it('should support hours', () => {
      expect(MS.toString(60 * 60 * 1000, { format })).toBe('1 hours');
      expect(MS.toString(60 * 60 * 10000, { format })).toBe('10 hours');

      expect(MS.toString(-1 * 60 * 60 * 1000, { format })).toBe('-1 hours');
      expect(MS.toString(-1 * 60 * 60 * 10000, { format })).toBe('-10 hours');
    });

    it('should support days', () => {
      expect(MS.toString(24 * 60 * 60 * 1000, { format })).toBe('1 days');
      expect(MS.toString(24 * 60 * 60 * 10000, { format })).toBe('10 days');

      expect(MS.toString(-1 * 24 * 60 * 60 * 1000, { format })).toBe('-1 days');
      expect(MS.toString(-1 * 24 * 60 * 60 * 10000, { format })).toBe('-10 days');
    });

    it('should return a verbose string of all the times', () => {
      expect(MS.toString(467454441145, { format })).toBe('14 years 300 days 8 hours 27 minutes 21 seconds 145 milliseconds');

      expect(MS.toString(-467454441145, { format })).toBe('-14 years -300 days -8 hours -27 minutes -21 seconds -145 milliseconds');
    });
  });

  describe('input = string', () => {
    describe('invalid input', () => {
      it('should throw an error when the value is not a valid duration string', () => {
        // @ts-expect-error
        expect(() => MS.toString('toto')).toThrowError();
      });
    });

    describe('no options', () => {
      describe('short format', () => {
        it('should support no unit', () => {
          expect(MS.toString('1')).toBe('1');
          expect(MS.toString('-1')).toBe('-1');

          expect(MS.toString('10')).toBe('10');
          expect(MS.toString('-10')).toBe('-10');
        });

        it('should support milliseconds', () => {
          expect(MS.toString('1ms')).toBe('1ms');
          expect(MS.toString('-1ms')).toBe('-1ms');

          expect(MS.toString('10ms')).toBe('10ms');
          expect(MS.toString('-10ms')).toBe('-10ms');
        });

        it('should support seconds', () => {
          expect(MS.toString('1s')).toBe('1s');
          expect(MS.toString('-1s')).toBe('-1s');

          expect(MS.toString('10s')).toBe('10s');
          expect(MS.toString('-10s')).toBe('-10s');
        });

        it('should support minutes', () => {
          expect(MS.toString('1m')).toBe('1m');
          expect(MS.toString('-1m')).toBe('-1m');

          expect(MS.toString('10m')).toBe('10m');
          expect(MS.toString('-10m')).toBe('-10m');
        });

        it('should support hours', () => {
          expect(MS.toString('1h')).toBe('1h');
          expect(MS.toString('-1h')).toBe('-1h');

          expect(MS.toString('10h')).toBe('10h');
          expect(MS.toString('-10h')).toBe('-10h');
        });

        it('should support days', () => {
          expect(MS.toString('1d')).toBe('1d');
          expect(MS.toString('-1d')).toBe('-1d');

          expect(MS.toString('10d')).toBe('10d');
          expect(MS.toString('-10d')).toBe('-10d');
        });

        it('should support weeks', () => {
          expect(MS.toString('1w')).toBe('1w');
          expect(MS.toString('-1w')).toBe('-1w');

          expect(MS.toString('10w')).toBe('10w');
          expect(MS.toString('-10w')).toBe('-10w');
        });

        it('should support years', () => {
          expect(MS.toString('1y')).toBe('1y');
          expect(MS.toString('-1y')).toBe('-1y');

          expect(MS.toString('10y')).toBe('10y');
          expect(MS.toString('-10y')).toBe('-10y');
        });
      });

      describe('long format', () => {
        it('should support milliseconds', () => {
          expect(MS.toString('1 millisecond')).toBe('1 millisecond');
          expect(MS.toString('-1 millisecond')).toBe('-1 millisecond');

          expect(MS.toString('10 milliseconds')).toBe('10 milliseconds');
          expect(MS.toString('-10 milliseconds')).toBe('-10 milliseconds');
        });

        it('should support seconds', () => {
          expect(MS.toString('1 second')).toBe('1 second');
          expect(MS.toString('-1 second')).toBe('-1 second');

          expect(MS.toString('10 seconds')).toBe('10 seconds');
          expect(MS.toString('-10 seconds')).toBe('-10 seconds');
        });

        it('should support minutes', () => {
          expect(MS.toString('1 minute')).toBe('1 minute');
          expect(MS.toString('-1 minute')).toBe('-1 minute');

          expect(MS.toString('10 minutes')).toBe('10 minutes');
          expect(MS.toString('-10 minutes')).toBe('-10 minutes');
        });

        it('should support hours', () => {
          expect(MS.toString('1 hour')).toBe('1 hour');
          expect(MS.toString('-1 hour')).toBe('-1 hour');

          expect(MS.toString('10 hours')).toBe('10 hours');
          expect(MS.toString('-10 hours')).toBe('-10 hours');
        });

        it('should support days', () => {
          expect(MS.toString('1 day')).toBe('1 day');
          expect(MS.toString('-1 day')).toBe('-1 day');

          expect(MS.toString('10 days')).toBe('10 days');
          expect(MS.toString('-10 days')).toBe('-10 days');
        });

        it('should support weeks', () => {
          expect(MS.toString('1 week')).toBe('1 week');
          expect(MS.toString('-1 week')).toBe('-1 week');

          expect(MS.toString('10 weeks')).toBe('10 weeks');
          expect(MS.toString('-10 weeks')).toBe('-10 weeks');
        });

        it('should support years', () => {
          expect(MS.toString('1 year')).toBe('1 year');
          expect(MS.toString('-1 year')).toBe('-1 year');

          expect(MS.toString('10 years')).toBe('10 years');
          expect(MS.toString('-10 years')).toBe('-10 years');
        });
      });
    });
  });
});

describe('MS.toNumber', () => {
  const maxLength = 100;

  describe('invalid input', () => {
    it('should throw an error when the string is too long', () => {
      const string = '9'.repeat(maxLength + 1) as `${number}`;
      expect(() => MS.toNumber(string)).toThrowError(/value exceeds the maximum length/i);
    });

    it('should throw an error when the string is invalid', () => {
      // @ts-expect-error
      expect(() => MS.toNumber('toto')).toThrowError(/invalid/i);
    });
  });

  describe('short string', () => {
    it('should preserve ms', () => {
      expect(MS.toNumber('100')).toBe(100);
    });

    it('should convert from m to ms', () => {
      expect(MS.toNumber('1m')).toBe(60000);
    });

    it('should convert from h to ms', () => {
      expect(MS.toNumber('1h')).toBe(3600000);
    });

    it('should convert d to ms', () => {
      expect(MS.toNumber('2d')).toBe(172800000);
    });

    it('should convert w to ms', () => {
      expect(MS.toNumber('3w')).toBe(1814400000);
    });

    it('should convert s to ms', () => {
      expect(MS.toNumber('1s')).toBe(1000);
    });

    it('should convert ms to ms', () => {
      expect(MS.toNumber('100ms')).toBe(100);
    });

    it('should convert y to ms', () => {
      expect(MS.toNumber('1y')).toBe(31557600000);
    });

    it('should work with decimals', () => {
      expect(MS.toNumber('1.5h')).toBe(5400000);
    });

    it('should work with multiple spaces', () => {
      expect(MS.toNumber('1   s')).toBe(1000);
    });

    it('should be case-insensitive', () => {
      expect(MS.toNumber('1.5H')).toBe(5400000);
    });

    it('should work with numbers starting with .', () => {
      expect(MS.toNumber('.5ms')).toBe(0.5);
    });

    it('should work with negative integers', () => {
      expect(MS.toNumber('-100ms')).toBe(-100);
    });

    it('should work with negative decimals', () => {
      expect(MS.toNumber('-1.5h')).toBe(-5400000);
      expect(MS.toNumber('-10.5h')).toBe(-37800000);
    });

    it('should work with negative decimals starting with "."', () => {
      expect(MS.toNumber('-.5h')).toBe(-1800000);
    });
  });

  describe('long string', () => {
    it('should convert milliseconds to ms', () => {
      expect(MS.toNumber('53 milliseconds')).toBe(53);
    });

    it('should convert msecs to ms', () => {
      expect(MS.toNumber('17 msecs')).toBe(17);
    });

    it('should convert sec to ms', () => {
      expect(MS.toNumber('1 sec')).toBe(1000);
    });

    it('should convert from min to ms', () => {
      expect(MS.toNumber('1 min')).toBe(60000);
    });

    it('should convert from hr to ms', () => {
      expect(MS.toNumber('1 hr')).toBe(3600000);
    });

    it('should convert days to ms', () => {
      expect(MS.toNumber('2 days')).toBe(172800000);
    });

    it('should convert weeks to ms', () => {
      expect(MS.toNumber('1 week')).toBe(604800000);
    });

    it('should convert years to ms', () => {
      expect(MS.toNumber('1 year')).toBe(31557600000);
    });

    it('should work with decimals', () => {
      expect(MS.toNumber('1.5 hours')).toBe(5400000);
    });

    it('should work with negative integers', () => {
      expect(MS.toNumber('-100 milliseconds')).toBe(-100);
    });

    it('should work with negative decimals', () => {
      expect(MS.toNumber('-1.5 hours')).toBe(-5400000);
    });

    it('should work with negative decimals starting with "."', () => {
      expect(MS.toNumber('-.5 hr')).toBe(-1800000);
    });
  });

  describe('number input', () => {
    it('should return the value as is', () => {
      expect(MS.toNumber(69)).toBe(69);
      expect(MS.toNumber(-69)).toBe(-69);
    });
  });
});

describe('MS.validate', () => {
  const maxLength = 100;

  describe('invalid input', () => {
    it('should return false when the string is too long', () => {
      const string = '9'.repeat(maxLength + 1) as `${number}`;
      expect(MS.validate(string)).toBe(false);
    });

    it('should return false when the string is invalid', () => {
      expect(MS.validate('toto')).toBe(false);
    });
  });

  describe('short string', () => {
    it('should preserve ms', () => {
      expect(MS.validate('100')).toBe(true);
    });

    it('should convert from m to ms', () => {
      expect(MS.validate('1m')).toBe(true);
    });

    it('should convert from h to ms', () => {
      expect(MS.validate('1h')).toBe(true);
    });

    it('should convert d to ms', () => {
      expect(MS.validate('2d')).toBe(true);
    });

    it('should convert w to ms', () => {
      expect(MS.validate('3w')).toBe(true);
    });

    it('should convert s to ms', () => {
      expect(MS.validate('1s')).toBe(true);
    });

    it('should convert ms to ms', () => {
      expect(MS.validate('100ms')).toBe(true);
    });

    it('should convert y to ms', () => {
      expect(MS.validate('1y')).toBe(true);
    });

    it('should work with decimals', () => {
      expect(MS.validate('1.5h')).toBe(true);
    });

    it('should work with multiple spaces', () => {
      expect(MS.validate('1   s')).toBe(true);
    });

    it('should be case-insensitive', () => {
      expect(MS.validate('1.5H')).toBe(true);
    });

    it('should work with numbers starting with .', () => {
      expect(MS.validate('.5ms')).toBe(true);
    });

    it('should work with negative integers', () => {
      expect(MS.validate('-100ms')).toBe(true);
    });

    it('should work with negative decimals', () => {
      expect(MS.validate('-1.5h')).toBe(true);
      expect(MS.validate('-10.5h')).toBe(true);
    });

    it('should work with negative decimals starting with "."', () => {
      expect(MS.validate('-.5h')).toBe(true);
    });
  });

  describe('long string', () => {
    it('should convert milliseconds to ms', () => {
      expect(MS.validate('53 milliseconds')).toBe(true);
    });

    it('should convert msecs to ms', () => {
      expect(MS.validate('17 msecs')).toBe(true);
    });

    it('should convert sec to ms', () => {
      expect(MS.validate('1 sec')).toBe(true);
    });

    it('should convert from min to ms', () => {
      expect(MS.validate('1 min')).toBe(true);
    });

    it('should convert from hr to ms', () => {
      expect(MS.validate('1 hr')).toBe(true);
    });

    it('should convert days to ms', () => {
      expect(MS.validate('2 days')).toBe(true);
    });

    it('should convert weeks to ms', () => {
      expect(MS.validate('1 week')).toBe(true);
    });

    it('should convert years to ms', () => {
      expect(MS.validate('1 year')).toBe(true);
    });

    it('should work with decimals', () => {
      expect(MS.validate('1.5 hours')).toBe(true);
    });

    it('should work with negative integers', () => {
      expect(MS.validate('-100 milliseconds')).toBe(true);
    });

    it('should work with negative decimals', () => {
      expect(MS.validate('-1.5 hours')).toBe(true);
    });

    it('should work with negative decimals starting with "."', () => {
      expect(MS.validate('-.5 hr')).toBe(true);
    });
  });
});

describe('MS.toggle', () => {
  describe('invalid inputs', () => {
    const maxLength = 100;

    it('should throw an error when the string is too long', () => {
      const string = '9'.repeat(maxLength + 1) as `${number}`;
      expect(() => MS.toggle(string)).toThrowError(/value exceeds the maximum length/i);
    });

    it('should throw an error when the string is invalid', () => {
      // @ts-expect-error
      expect(() => MS.toggle('toto')).toThrowError(/invalid/i);
    });

    it('should throw an error when the value is Infinity', () => {
      expect(() => MS.toggle(Infinity)).toThrowError();
    });

    it('should throw an error when the value is -Infinity', () => {
      expect(() => MS.toggle(-Infinity)).toThrowError();
    });

    it('should throw an error when the value is NaN', () => {
      expect(() => MS.toggle(NaN)).toThrowError();
    });

    it('should throw an error when the value is a string', () => {
      // @ts-expect-error - We expect this to throw.
      expect(() => MS.toggle('')).toThrowError();
    });

    it('should throw an error when the value is a string with more than 100 characters', () => {
      // @ts-expect-error - We expect this to throw.
      expect(() => MS.toggle('1'.repeat(101))).toThrowError();
    });

    it('should throw an error when the value is undefined', () => {
      // @ts-expect-error - We expect this to throw.
      expect(() => MS.toggle(undefined)).toThrowError();
    });

    it('should throw an error when the value is null', () => {
      // @ts-expect-error - We expect this to throw.
      expect(() => MS.toggle(null)).toThrowError();
    });

    it('should throw an error when the value is an array', () => {
      // @ts-expect-error - We expect this to throw.
      expect(() => MS.toggle([])).toThrowError();
    });

    it('should throw an error when the value is an object', () => {
      // @ts-expect-error - We expect this to throw.
      expect(() => MS.toggle({})).toThrowError();
    });
  });

  describe('number input', () => {
    describe('default format = short', () => {
      it('should support milliseconds', () => {
        expect(MS.toggle(500)).toBe('500ms');

        expect(MS.toggle(-500)).toBe('-500ms');
      });

      it('should support seconds', () => {
        expect(MS.toggle(1000)).toBe('1s');
        expect(MS.toggle(10000)).toBe('10s');

        expect(MS.toggle(-1000)).toBe('-1s');
        expect(MS.toggle(-10000)).toBe('-10s');
      });

      it('should support minutes', () => {
        expect(MS.toggle(60 * 1000)).toBe('1m');
        expect(MS.toggle(60 * 10000)).toBe('10m');

        expect(MS.toggle(-1 * 60 * 1000)).toBe('-1m');
        expect(MS.toggle(-1 * 60 * 10000)).toBe('-10m');
      });

      it('should support hours', () => {
        expect(MS.toggle(60 * 60 * 1000)).toBe('1h');
        expect(MS.toggle(60 * 60 * 10000)).toBe('10h');

        expect(MS.toggle(-1 * 60 * 60 * 1000)).toBe('-1h');
        expect(MS.toggle(-1 * 60 * 60 * 10000)).toBe('-10h');
      });

      it('should support days', () => {
        expect(MS.toggle(24 * 60 * 60 * 1000)).toBe('1d');
        expect(MS.toggle(24 * 60 * 60 * 10000)).toBe('10d');

        expect(MS.toggle(-1 * 24 * 60 * 60 * 1000)).toBe('-1d');
        expect(MS.toggle(-1 * 24 * 60 * 60 * 10000)).toBe('-10d');
      });

      it('should round', () => {
        expect(MS.toggle(234234234)).toBe('3d');

        expect(MS.toggle(-234234234)).toBe('-3d');
      });
    });

    describe('short format', () => {
      const format: MS.DurationFormat = 'short';

      it('should support milliseconds', () => {
        expect(MS.toggle(500, { format })).toBe('500ms');

        expect(MS.toggle(-500, { format })).toBe('-500ms');
      });

      it('should support seconds', () => {
        expect(MS.toggle(1000, { format })).toBe('1s');
        expect(MS.toggle(10000, { format })).toBe('10s');

        expect(MS.toggle(-1000, { format })).toBe('-1s');
        expect(MS.toggle(-10000, { format })).toBe('-10s');
      });

      it('should support minutes', () => {
        expect(MS.toggle(60 * 1000, { format })).toBe('1m');
        expect(MS.toggle(60 * 10000, { format })).toBe('10m');

        expect(MS.toggle(-1 * 60 * 1000, { format })).toBe('-1m');
        expect(MS.toggle(-1 * 60 * 10000, { format })).toBe('-10m');
      });

      it('should support hours', () => {
        expect(MS.toggle(60 * 60 * 1000, { format })).toBe('1h');
        expect(MS.toggle(60 * 60 * 10000, { format })).toBe('10h');

        expect(MS.toggle(-1 * 60 * 60 * 1000, { format })).toBe('-1h');
        expect(MS.toggle(-1 * 60 * 60 * 10000, { format })).toBe('-10h');
      });

      it('should support days', () => {
        expect(MS.toggle(24 * 60 * 60 * 1000, { format })).toBe('1d');
        expect(MS.toggle(24 * 60 * 60 * 10000, { format })).toBe('10d');

        expect(MS.toggle(-1 * 24 * 60 * 60 * 1000, { format })).toBe('-1d');
        expect(MS.toggle(-1 * 24 * 60 * 60 * 10000, { format })).toBe('-10d');
      });

      it('should round', () => {
        expect(MS.toggle(234234234, { format })).toBe('3d');

        expect(MS.toggle(-234234234, { format })).toBe('-3d');
      });
    });

    describe('long format', () => {
      const format: MS.DurationFormat = 'long';

      it('should support milliseconds', () => {
        expect(MS.toggle(500, { format })).toBe('500 ms');

        expect(MS.toggle(-500, { format })).toBe('-500 ms');
      });

      it('should support seconds', () => {
        expect(MS.toggle(1000, { format })).toBe('1 second');
        expect(MS.toggle(10000, { format })).toBe('10 seconds');

        expect(MS.toggle(-1000, { format })).toBe('-1 second');
        expect(MS.toggle(-10000, { format })).toBe('-10 seconds');
      });

      it('should support minutes', () => {
        expect(MS.toggle(60 * 1000, { format })).toBe('1 minute');
        expect(MS.toggle(60 * 10000, { format })).toBe('10 minutes');

        expect(MS.toggle(-1 * 60 * 1000, { format })).toBe('-1 minute');
        expect(MS.toggle(-1 * 60 * 10000, { format })).toBe('-10 minutes');
      });

      it('should support hours', () => {
        expect(MS.toggle(60 * 60 * 1000, { format })).toBe('1 hour');
        expect(MS.toggle(60 * 60 * 10000, { format })).toBe('10 hours');

        expect(MS.toggle(-1 * 60 * 60 * 1000, { format })).toBe('-1 hour');
        expect(MS.toggle(-1 * 60 * 60 * 10000, { format })).toBe('-10 hours');
      });

      it('should support days', () => {
        expect(MS.toggle(24 * 60 * 60 * 1000, { format })).toBe('1 day');
        expect(MS.toggle(24 * 60 * 60 * 10000, { format })).toBe('10 days');

        expect(MS.toggle(-1 * 24 * 60 * 60 * 1000, { format })).toBe('-1 day');
        expect(MS.toggle(-1 * 24 * 60 * 60 * 10000, { format })).toBe('-10 days');
      });

      it('should round', () => {
        expect(MS.toggle(234234234, { format })).toBe('3 days');

        expect(MS.toggle(-234234234, { format })).toBe('-3 days');
      });
    });

    describe('verbose format', () => {
      const format: MS.DurationFormat = 'verbose';

      it('should support milliseconds', () => {
        expect(MS.toggle(500, { format })).toBe('500 milliseconds');

        expect(MS.toggle(-500, { format })).toBe('-500 milliseconds');
      });

      it('should support seconds', () => {
        expect(MS.toggle(1000, { format })).toBe('1 seconds');
        expect(MS.toggle(10000, { format })).toBe('10 seconds');

        expect(MS.toggle(-1000, { format })).toBe('-1 seconds');
        expect(MS.toggle(-10000, { format })).toBe('-10 seconds');
      });

      it('should support minutes', () => {
        expect(MS.toggle(60 * 1000, { format })).toBe('1 minutes');
        expect(MS.toggle(60 * 10000, { format })).toBe('10 minutes');

        expect(MS.toggle(-1 * 60 * 1000, { format })).toBe('-1 minutes');
        expect(MS.toggle(-1 * 60 * 10000, { format })).toBe('-10 minutes');
      });

      it('should support hours', () => {
        expect(MS.toggle(60 * 60 * 1000, { format })).toBe('1 hours');
        expect(MS.toggle(60 * 60 * 10000, { format })).toBe('10 hours');

        expect(MS.toggle(-1 * 60 * 60 * 1000, { format })).toBe('-1 hours');
        expect(MS.toggle(-1 * 60 * 60 * 10000, { format })).toBe('-10 hours');
      });

      it('should support days', () => {
        expect(MS.toggle(24 * 60 * 60 * 1000, { format })).toBe('1 days');
        expect(MS.toggle(24 * 60 * 60 * 10000, { format })).toBe('10 days');

        expect(MS.toggle(-1 * 24 * 60 * 60 * 1000, { format })).toBe('-1 days');
        expect(MS.toggle(-1 * 24 * 60 * 60 * 10000, { format })).toBe('-10 days');
      });

      it('should return a verbose string of all the times', () => {
        expect(MS.toggle(467454441145, { format })).toBe('14 years 300 days 8 hours 27 minutes 21 seconds 145 milliseconds');

        expect(MS.toggle(-467454441145, { format })).toBe('-14 years -300 days -8 hours -27 minutes -21 seconds -145 milliseconds');
      });
    });
  });

  describe('string input', () => {
    describe('short string', () => {
      it('should preserve ms', () => {
        expect(MS.toggle('100')).toBe(100);
      });

      it('should convert from m to ms', () => {
        expect(MS.toggle('1m')).toBe(60000);
      });

      it('should convert from h to ms', () => {
        expect(MS.toggle('1h')).toBe(3600000);
      });

      it('should convert d to ms', () => {
        expect(MS.toggle('2d')).toBe(172800000);
      });

      it('should convert w to ms', () => {
        expect(MS.toggle('3w')).toBe(1814400000);
      });

      it('should convert s to ms', () => {
        expect(MS.toggle('1s')).toBe(1000);
      });

      it('should convert ms to ms', () => {
        expect(MS.toggle('100ms')).toBe(100);
      });

      it('should convert y to ms', () => {
        expect(MS.toggle('1y')).toBe(31557600000);
      });

      it('should work with decimals', () => {
        expect(MS.toggle('1.5h')).toBe(5400000);
      });

      it('should work with multiple spaces', () => {
        expect(MS.toggle('1   s')).toBe(1000);
      });

      it('should be case-insensitive', () => {
        expect(MS.toggle('1.5H')).toBe(5400000);
      });

      it('should work with numbers starting with .', () => {
        expect(MS.toggle('.5ms')).toBe(0.5);
      });

      it('should work with negative integers', () => {
        expect(MS.toggle('-100ms')).toBe(-100);
      });

      it('should work with negative decimals', () => {
        expect(MS.toggle('-1.5h')).toBe(-5400000);
        expect(MS.toggle('-10.5h')).toBe(-37800000);
      });

      it('should work with negative decimals starting with "."', () => {
        expect(MS.toggle('-.5h')).toBe(-1800000);
      });
    });

    describe('long string', () => {
      it('should convert milliseconds to ms', () => {
        expect(MS.toggle('53 milliseconds')).toBe(53);
      });

      it('should convert msecs to ms', () => {
        expect(MS.toggle('17 msecs')).toBe(17);
      });

      it('should convert sec to ms', () => {
        expect(MS.toggle('1 sec')).toBe(1000);
      });

      it('should convert from min to ms', () => {
        expect(MS.toggle('1 min')).toBe(60000);
      });

      it('should convert from hr to ms', () => {
        expect(MS.toggle('1 hr')).toBe(3600000);
      });

      it('should convert days to ms', () => {
        expect(MS.toggle('2 days')).toBe(172800000);
      });

      it('should convert weeks to ms', () => {
        expect(MS.toggle('1 week')).toBe(604800000);
      });

      it('should convert years to ms', () => {
        expect(MS.toggle('1 year')).toBe(31557600000);
      });

      it('should work with decimals', () => {
        expect(MS.toggle('1.5 hours')).toBe(5400000);
      });

      it('should work with negative integers', () => {
        expect(MS.toggle('-100 milliseconds')).toBe(-100);
      });

      it('should work with negative decimals', () => {
        expect(MS.toggle('-1.5 hours')).toBe(-5400000);
      });

      it('should work with negative decimals starting with "."', () => {
        expect(MS.toggle('-.5 hr')).toBe(-1800000);
      });
    });
  });
});

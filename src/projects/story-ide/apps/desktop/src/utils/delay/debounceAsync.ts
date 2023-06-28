import { debounce } from 'radash';

export const debounceAsync = <TArgs extends any[], TReturn>(
  { delay }: { delay: number },
  func: (...args: TArgs) => TReturn,
): ((...args: TArgs) => Promise<Awaited<TReturn>>) => {
  const wrappedFunc = async (callback: DebounceCallback<TReturn>, ...args: TArgs): Promise<void> => {
    try {
      const result = await func(...args);
      callback(undefined, result);
    } catch (error) {
      callback(error);
    }
  }
  const debouncedFunc = debounce({ delay }, wrappedFunc);

  return (...args: TArgs): Promise<Awaited<TReturn>> => {
    return new Promise((resolve, reject) => {
      debouncedFunc(
        (error, result) => {
          if (error) reject(error);
            // @ts-ignore failed to write 100% type-safe code here
          else resolve(result);
        },
        ...args,
      );
    });
  }
}

type DebounceCallback<T> = (error?: unknown | undefined, result?: T | undefined) => void;

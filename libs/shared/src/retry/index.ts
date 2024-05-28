import { InternalError } from "../@dntb/typed-errors";
import { Sleep } from "../sleep";

export class TooManyRetries extends InternalError {
  retryError: string;

  constructor(retryError: unknown) {
    super("Too many retries");

    this.retryError = JSON.stringify(
      retryError,
      Object.getOwnPropertyNames(retryError)
    );
  }
}

export const fixedTimeoutBetweenCalls = (fix: number) => () =>
  fix + Math.random() * 100;

export const linearTimeoutBetweenCalls = (current: number) =>
  1000 * current + Math.random() * 100;

export const exponentialTimeoutBetweenCalls = (current: number) =>
  1000 * Math.pow(2, current) + Math.random() * 100;

export interface RetryOptions {
  total?: number;
  current?: number;
  errorLog?: (error: unknown) => unknown;
  timeoutBetweenCalls?: (current: number, total: number) => number;
  unref?: boolean;
}

export const Retry = {
  onError: async <R>(
    fn: () => R | Promise<R>,
    options: RetryOptions = {}
  ): Promise<R> => {
    const {
      total = 5,
      current = 0,
      errorLog,
      timeoutBetweenCalls = linearTimeoutBetweenCalls,
      unref = true,
    } = options;

    try {
      if (current > 0) {
        await Sleep.run(timeoutBetweenCalls(current, total), { unref });
      }

      return await fn();
    } catch (err) {
      if (errorLog) {
        errorLog(err);
      }

      if (current === total) {
        throw new TooManyRetries(err);
      }

      return Retry.onError(fn, {
        ...options,
        current: current + 1,
      });
    }
  },
  onErrorWrapper:
    <Args extends unknown[], Result>(
      fn: (...args: Args) => Result,
      options: RetryOptions = {}
    ) =>
    (...args: Args): Promise<Result> => {
      return Retry.onError(() => {
        return fn(...args);
      }, options);
    },
  linearTimeoutBetweenCalls,
  exponentialTimeoutBetweenCalls,
};

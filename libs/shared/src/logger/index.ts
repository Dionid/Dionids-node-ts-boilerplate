import { pino } from "pino";
import { BaseError } from "../@dnb";

export const Logger = {
  init: (
    mixin: () => Record<string, unknown>,
    sync = true,
    stdErrSerializer = true
  ): pino.Logger => {
    const opts: pino.LoggerOptions = {
      mixin,
      level: process.env.LOG_LEVEL ?? "info",
    };

    if (!stdErrSerializer) {
      opts.serializers = {
        err: (err) => {
          if (err instanceof Error) {
            if (err instanceof BaseError) {
              return {
                message: err.message,
                name: err.name,
                code: err.statusCode,
                type: err.type,
              };
            } else {
              return {
                message: err.message,
                name: err.name,
              };
            }
          }
          return {
            message: JSON.stringify(err),
          };
        },
      };
    }

    const pinoLogger = pino(
      opts,
      pino.destination({
        sync,
      })
    );
    pinoLogger.info = pinoLogger.info.bind(pinoLogger);
    pinoLogger.debug = pinoLogger.debug.bind(pinoLogger);
    pinoLogger.warn = pinoLogger.warn.bind(pinoLogger);
    pinoLogger.error = pinoLogger.error.bind(pinoLogger);

    return pinoLogger;
  },
  addFnStack: (logger: pino.Logger, fnName: string): pino.Logger => {
    const fnStack: string[] | undefined = logger.bindings().fnStack as
      | string[]
      | undefined;

    return logger.child({
      fnStack: fnStack ? [...fnStack, fnName] : [fnName],
    });
  },
  logRethrow: async <R>(
    logger: pino.Logger,
    fn: () => Promise<R>
  ): Promise<R> => {
    try {
      return await fn();
    } catch (e) {
      logger.error(e);
      throw e;
    }
  },
  logAndReturnError: <T extends Error>(logger: pino.Logger, err: T): T => {
    logger.error({ err });
    return err;
  },
};

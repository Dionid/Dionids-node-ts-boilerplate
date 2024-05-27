import { Logger } from "pino";

export const initUnhandled = (logger?: Logger) => {
  process.on("uncaughtException", (err) => {
    if (logger) {
      logger.error({ uncaughtException: true, err });
    } else {
      // eslint-disable-next-line no-restricted-syntax
      console.error("uncaughtException", err);
    }
  });

  process.on("unhandledRejection", (err) => {
    if (logger) {
      logger.error({ unhandledRejection: true, err });
    } else {
      // eslint-disable-next-line no-restricted-syntax
      console.error("unhandledRejection", err);
    }
  });
};

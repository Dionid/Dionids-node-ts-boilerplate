import { FastifyInstance } from "fastify";
import { Knex } from "knex";
import { Kysely } from "kysely";
import { Server } from "nice-grpc";
import pino from "pino";
import { ReactiveCounter } from "../../reactive-counter";
import { Sleep } from "../../sleep";

export const shutdown =
  (
    propsLogger: pino.Logger,
    timeoutInSeconds: number = 30,
    cb: () => Promise<void>
  ) =>
  async (signal: string, err?: Error) => {
    // . Setup logger
    const logger = propsLogger.child({
      shuttingDown: true,
      signal,
      timeoutInSeconds,
    });

    // . Add death timer
    setTimeout(() => {
      logger.error("terminate process after timeoutInSeconds");
      process.exit(1);
    }, timeoutInSeconds * 1000).unref();

    try {
      // . Log application shutting down
      let logStr = "Application is shutting down";

      if (err) {
        logStr += ` because of error: ${JSON.stringify(
          err,
          Object.getOwnPropertyNames(err)
        )}`;
      }

      logger.warn(logStr);

      await cb();

      // # Log
      logger.info("bye bye!");

      // # Exit
      if (err) {
        process.exit(1);
      }

      process.exit(0);
    } catch (e) {
      logger.error(e);
      process.exit(1);
    }
  };

export const initGracefulShutdown = (opts: {
  logger: pino.Logger;
  abortController: AbortController;
  rc: ReactiveCounter;
  fastifyServer?: FastifyInstance;
  grpcServer?: Server<unknown>;
  signals?: NodeJS.Signals[];
  timeout?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db?: Kysely<any>;
  hooks?: {
    beforeAll?: () => Promise<void>;
    beforeRcStop?: () => Promise<void>;
    afterRcStop?: () => Promise<void>;
    afterAll?: () => Promise<void>;
  };
  dbRo?: Knex;
}) => {
  const {
    fastifyServer,
    grpcServer,
    logger,
    abortController,
    rc,
    db,
    dbRo,
    hooks = {},
    timeout,
  } = opts;

  let gracefulShutdownStarted = false;

  const onShutdown = async () => {
    logger.info("Graceful shutdown started");
    if (hooks.beforeAll) {
      await hooks.beforeAll();
    }
    if (gracefulShutdownStarted) {
      await Sleep(100000, { unref: false });
      return;
    } else {
      gracefulShutdownStarted = true;
    }
    abortController.abort();
    if (fastifyServer) {
      await fastifyServer.close();
    }
    if (grpcServer) {
      await grpcServer.shutdown();
    }
    if (hooks.beforeRcStop) {
      await hooks.beforeRcStop();
    }
    await rc.waitUntil(0);
    if (hooks.afterRcStop) {
      await hooks.afterRcStop();
    }
    if (db) {
      await db.destroy();
    }
    if (dbRo) {
      await dbRo.destroy();
    }
    if (hooks.afterAll) {
      await hooks.afterAll();
    }
    logger.info("Graceful shutdown completed");
  };

  const signals = opts.signals ?? ["SIGINT", "SIGTERM"];

  signals.forEach((signal) => {
    process.on(signal, shutdown(logger, timeout, onShutdown));
  });

  return;
};

import path from "path";
/* eslint-disable import/order */
import dotenv from "dotenv";
dotenv.config({ path: path.join(process.cwd(), "src/apps/sphoenix/.env") });

// TRACING
import {
  waitUntilAllMigrationsAreDone,
  initUnhandled,
  ReactiveCounter,
  Logger,
  KDB,
  setErrorHandler,
  initGracefulShutdown,
} from "@dnb/libs-common";
// useTracing({
//   consoleTracerEnabled: process.env.TRACING_CONSOLE_ENABLED === "true",
//   tracingEnabled: process.env.TRACING_ENABLED === "true",
//   serviceName: process.env.SERVICE_NAME ?? "sphoenix",
//   env: process.env.NODE_ENV ?? "development",
//   serviceVersion: process.env.SERVICE_VERSION ?? "latest",
// });

/* eslint-enable import/order */

import Fastify from "fastify";
import IORedis from "ioredis";

import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { v4 } from "uuid";
import { Config } from "./config";

export const main = async () => {
  // # Utils
  const abortController = new AbortController();
  const rc = ReactiveCounter.new();

  // # Config
  const config = Config();

  // # Logger
  const appId = v4();
  const logger = Logger.init(() => {
    return {
      appEnvironment: config.nodeEnv,
      appRevision: config.serviceVersion,
      appName: "sphoenix",
      appStartUpTS: new Date(),
      appId,
    };
  });

  // # Unhandled
  initUnhandled(logger);

  // # DB
  const dialect = new PostgresDialect({
    pool: new Pool({
      connectionString: config.pgConnection,
    }),
  });

  const db = new Kysely<KDB>({
    dialect,
  });

  await waitUntilAllMigrationsAreDone(db, logger);

  // # Redis
  // const redis = new IORedis(config.redisConnection);

  // # HTTP
  const httpGateway = Fastify({});

  setErrorHandler(
    { logger, isProd: config.nodeEnv === "production" },
    httpGateway
  );

  // # Graceful shutdown
  initGracefulShutdown({
    logger,
    abortController,
    rc,
    db,
  });

  await httpGateway.listen({ port: 3000 });
};

main().catch((err) => {
  // eslint-disable-next-line no-restricted-syntax
  console.error("Process terminated", err);

  process.exit(1);
});

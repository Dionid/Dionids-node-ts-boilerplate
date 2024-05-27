import path from "path";

import { Env } from "@dnb/libs-common";
import dotenv from "dotenv";
import { v4 } from "uuid";

dotenv.config({ path: path.join(__dirname, ".env") });

const getEnvOrThrowWithLog = Env.getEnvOrThrow(console.error);

export type TestConfig = {
  isCI: boolean;
  isInfraSkipped: boolean;
  nodeEnv: string;
  serviceName: string;
  migrations: {
    containerName: string;
  };
  fixtures: {
    containerName: string;
  };
  app: {
    startUpTS: Date;
    id: string;
  };
  serviceVersion: string;
  mainPg: {
    database: string;
    uri: string;
  };
  rabbitMQ: {
    containerName: string;
    hostname: string;
    port: number;
    username: string;
    password: string;
    heartbeat: number;
    vhost: string;
    prefix: string;
    postfix: string;
  };
  redisConnection: string;
};

export const TestConfig = () => {
  const database = process.env.SATAN_DB_NAME ?? "smvd-next-satan";

  const IS_CI = getEnvOrThrowWithLog("IS_CI") === "true";

  return {
    isCI: IS_CI,
    nodeEnv: getEnvOrThrowWithLog("NODE_ENV"),
    isInfraSkipped: getEnvOrThrowWithLog("SKIP_INFRA") === "true",
    serviceName: "sparta",
    serviceVersion: getEnvOrThrowWithLog("SERVICE_VERSION"),
    migrations: {
      containerName: getEnvOrThrowWithLog("MIGRATIONS_CONTAINER_NAME"),
    },
    redisConnection: getEnvOrThrowWithLog("REDIS_CONNECTION"),
    fixtures: {
      containerName: getEnvOrThrowWithLog("FIXTURES_CONTAINER_NAME"),
    },
    app: {
      startUpTS: new Date(),
      id: v4(),
    },
    mainPg: {
      database,
      uri: getEnvOrThrowWithLog("SATAN_DB_URI").replace(`/${database}`, ""),
    },
    rabbitMQ: {
      containerName: getEnvOrThrowWithLog("RABBITMQ_CONTAINER_NAME"),
      hostname: getEnvOrThrowWithLog("RABBITMQ_HOST"),
      port: +getEnvOrThrowWithLog("RABBITMQ_PORT"),
      username: getEnvOrThrowWithLog("RABBITMQ_USERNAME"),
      password: getEnvOrThrowWithLog("RABBITMQ_PASSWORD"),
      heartbeat: +getEnvOrThrowWithLog("RABBITMQ_HEARTBEAT"),
      vhost: getEnvOrThrowWithLog("RABBITMQ_VHOST"),
      prefix: getEnvOrThrowWithLog("RABBITMQ_PREFIX"),
      postfix: getEnvOrThrowWithLog("RABBITMQ_POSTFIX"),
    },
  };
};

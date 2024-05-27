import { Env, NodeEnv } from "@dnb/libs-common";

export const Config = () => {
  const getEnvOrThrowWithLog = Env.getEnvOrThrow(console.error);

  return {
    nodeEnv: NodeEnv.fromString(getEnvOrThrowWithLog("NODE_ENV")),
    rootApiPrefix: process.env.ROOT_API_PREFIX
      ? process.env.ROOT_API_PREFIX
      : "/api/",
    serviceName: getEnvOrThrowWithLog("SERVICE_NAME"),
    serviceVersion: getEnvOrThrowWithLog("SERVICE_VERSION"),
    pgConnection: getEnvOrThrowWithLog("MAIN_DB_URI"),
    redisConnection: getEnvOrThrowWithLog("REDIS_CONNECTION"),
    httpPort: parseInt(getEnvOrThrowWithLog("GATEWAY_PORT")),
  };
};

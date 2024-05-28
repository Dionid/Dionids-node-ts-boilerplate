import { InternalError } from "../@dntb/typed-errors";

export const getEnvOrThrow =
  (log?: (e: Error) => unknown) =>
  (envName: string): string => {
    const value = process.env[envName];

    if (!value) {
      const err = new InternalError(`Env variable '${envName}' is required`);

      if (log) {
        log(err);
      }

      throw err;
    }

    return value;
  };

export const Env = {
  getEnvOrThrow,
};

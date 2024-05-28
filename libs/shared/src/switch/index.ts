import { InternalError } from "../@dntb";

export const safeGuard = (arg: never, err?: Error) => {
  if (err) {
    throw err;
  }

  throw new InternalError("Safe guard executed!");
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const safeGuardWithoutThrow = (_: never) => {
  return;
};

export const Switch = {
  safeGuard,
  safeGuardWithoutThrow,
};

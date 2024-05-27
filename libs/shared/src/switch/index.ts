import { InternalError } from "../@dnb";

export const safeGuard = (arg: never, err?: Error) => {
  if (err) {
    throw err;
  }

  throw new InternalError("Safe guard executed!");
};

export const safeGuardWithoutThrow = (arg: never) => {
  return;
};

export const Switch = {
  safeGuard,
  safeGuardWithoutThrow,
};

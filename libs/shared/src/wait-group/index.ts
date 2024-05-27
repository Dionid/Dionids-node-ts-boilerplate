import { Deferred } from "../deferred";

export type WaitGroup = {
  _promises: Array<Deferred<boolean>>;
  add: (value?: number) => void;
  done: () => void;
  wait: () => Promise<boolean[]>;
};

export const NewWaitGroup = (val = 0): WaitGroup => {
  const promises: Array<Deferred<boolean>> = [];

  for (let i = 0; i < val; i++) {
    promises.push(Deferred.new<boolean>());
  }

  let cursor = 0;

  return {
    _promises: promises,
    add: (addVal = 1) => {
      for (let i = 0; i < addVal; i++) {
        promises.push(Deferred.new<boolean>());
      }
    },
    done: () => {
      const promise = promises[cursor];

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!promise) {
        throw new Error("No promise found");
      }

      promise.resolve(true);
      cursor += 1;
    },
    wait: () => {
      return Promise.all(promises.map((df) => df()));
    },
  };
};

export const WaitGroup = {
  new: NewWaitGroup,
};

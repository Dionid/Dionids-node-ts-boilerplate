import { v4 } from "uuid";

export type ReactiveCounter = {
  value: () => number;
  set: (value: number) => void;
  add: (value: number) => void;
  increment: () => void;
  decrement: () => void;
  subscribe: (fn: (newVal: number, oldVal: number) => unknown) => () => void;
  waitUntil: (value: number) => Promise<true>;
  waitUntilOrLess: (value: number) => Promise<true>;
};

const NewReactiveCounter = (
  initialValue = 0,
  zeroAndGreater = true
): ReactiveCounter => {
  let value = initialValue;
  const subscribers = new Map<
    string,
    (newVal: number, oldVal: number) => unknown
  >();

  const set = (newValue: number) => {
    if (zeroAndGreater && newValue < 0) {
      return;
    }

    const oldVal = value;
    value = newValue;

    for (const subscriber of subscribers.values()) {
      subscriber(newValue, oldVal);
    }
  };

  const subscribe = (fn: (newVal: number, oldVal: number) => unknown) => {
    const id = v4();
    subscribers.set(id, fn);

    return () => {
      subscribers.delete(id);
    };
  };

  return {
    value: () => value,
    subscribe,
    set,
    add: (addVal: number) => {
      set(value + addVal);
    },
    increment: () => {
      set(value + 1);
    },
    decrement: () => {
      set(value - 1);
    },
    waitUntil: async (valBecame: number): Promise<true> => {
      if (value === valBecame) {
        return true;
      }

      return new Promise((resolve) => {
        const unsubscribe = subscribe((newVal) => {
          if (newVal === valBecame) {
            resolve(true);
            unsubscribe();
          }
        });
      });
    },
    waitUntilOrLess: async (valBecame: number): Promise<true> => {
      if (value <= valBecame) {
        return true;
      }

      return new Promise((resolve) => {
        const unsubscribe = subscribe((newVal) => {
          if (newVal <= valBecame) {
            resolve(true);
            unsubscribe();
          }
        });
      });
    },
  };
};

export const ReactiveCounter = {
  new: NewReactiveCounter,
};

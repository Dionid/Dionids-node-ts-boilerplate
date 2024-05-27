export const diff = <T>(a: T[], b: T[]) =>
  [a, b].reduce((a, b) => a.filter((c) => !b.includes(c)));

export const filterUndefined = <T>(arr: Array<T | undefined>): T[] => {
  return arr.filter((data): data is T => data !== undefined);
};

export const filterNull = <T>(arr: Array<T | null>): T[] => {
  return arr.filter((data): data is T => data !== null);
};

export const TypedArray = {
  diff,
  filterUndefined,
  filterNull,
};

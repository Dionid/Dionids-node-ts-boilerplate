export const Sleep = (
  ms: number,
  options: { unref: boolean } = { unref: true }
): Promise<void> => {
  return new Promise((res) => {
    const { unref } = options;

    if (unref) {
      return setTimeout(res, ms).unref();
    } else {
      return setTimeout(res, ms);
    }
  });
};

Sleep.run = Sleep;

Sleep.error = (
  ms: number,
  error?: Error,
  options: { unref: boolean } = { unref: true }
) => {
  return new Promise((res, rej) => {
    const { unref } = options;

    if (unref) {
      setTimeout(() => {
        rej(error);
      }, ms).unref();
    } else {
      setTimeout(() => {
        rej(error);
      }, ms);
    }
  });
};

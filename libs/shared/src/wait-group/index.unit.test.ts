import { WaitGroup } from "./index";

describe("WaitGroup", () => {
  it("should succeed", async () => {
    const wg = WaitGroup.new();

    wg.add();
    wg.add();

    expect(wg._promises.length).toBe(2);

    setTimeout(() => {
      // eslint-disable-next-line no-restricted-syntax
      console.log("Done");

      wg.done();
      wg.done();
    }, 500);

    await wg.wait();

    // eslint-disable-next-line no-restricted-syntax
    console.log("Waited");
  });

  it("should succeed with 2", async () => {
    const wg = WaitGroup.new(2);

    expect(wg._promises.length).toBe(2);

    setTimeout(() => {
      // eslint-disable-next-line no-restricted-syntax
      console.log("Done");

      wg.done();
      wg.done();
    }, 500);

    await wg.wait();

    // eslint-disable-next-line no-restricted-syntax
    console.log("Waited");
  });
});

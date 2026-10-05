const assert = require("node:assert/strict");
const test = require("node:test");
const { captureStableScreenshot } = require("./browser-display-harness.cjs");

test("waits for consecutive identical captures without accepting a transient frame", async () => {
  const transient = Buffer.from("transient rounded shadow");
  const settled = Buffer.from("settled rounded shadow");
  const frames = [transient, settled, transient, settled, settled];
  let captures = 0;
  const result = await captureStableScreenshot({
    async screenshot(options) {
      assert.equal(options.animations, "disabled");
      assert.equal(options.fullPage, true);
      assert.ok(options.timeout > 0);
      return frames[captures++];
    },
  });
  assert.equal(captures, 5);
  assert.equal(result, settled);
});

test("fails when the page never produces consecutive identical captures", async (t) => {
  t.mock.timers.enable({ apis: ["Date"] });
  let captures = 0;
  await assert.rejects(
    captureStableScreenshot(
      {
        async screenshot() {
          t.mock.timers.tick(1);
          return Buffer.from(`changing frame ${captures++}`);
        },
      },
      { timeout: 5 },
    ),
    /Screenshot did not stabilize within 5ms/,
  );
  assert.equal(captures, 5);
});

test("propagates screenshot errors instead of retrying failed captures", async () => {
  const failure = new Error("Page closed during capture");
  let captures = 0;
  await assert.rejects(
    captureStableScreenshot({
      async screenshot() {
        captures++;
        throw failure;
      },
    }),
    (error) => error === failure,
  );
  assert.equal(captures, 1);
});

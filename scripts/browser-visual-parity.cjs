// Compare the same public component inputs in Vue, React and Web Components.
// Build the package first. Images are compared within one browser/OS run, so no
// platform-specific golden screenshots or image-processing dependency is needed.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  boot,
  captureStableScreenshot,
} = require("./browser-display-harness.cjs");
const extraScenarios = require("./browser-visual-scenarios.cjs");
const {
  waitForFiniteAnimations,
} = require("../packages/storybook/helpers/animations.mts");

const categories = [
  "basic",
  "data-display",
  "data-entry",
  "feedback",
  "form",
  "layout",
  "navigation",
  "overlayer",
];
const engine = process.env.PEAUI_BROWSER || "chromium";
const output = path.resolve(
  process.env.VERIFICATION_SCREENSHOTS ||
    `test-results/visual-parity-${engine}`,
);
const report = path.resolve(
  process.env.VERIFICATION_REPORT || path.join(output, "results.json"),
);
const fixture = `
import { getReactStoryArgs } from './packages/library/src/react/story-args.tsx';
import { generatedComponentApi } from './packages/docs/src/generated/component-api.ts';
const plainText = node => Array.isArray(node) ? node.map(plainText).join(' ') : node && typeof node === 'object' && node.props ? plainText(node.props.children) : typeof node === 'string' || typeof node === 'number' ? String(node) : '';
window.visualSamples = generatedComponentApi.map(api => {
  const args = getReactStoryArgs(api.name);
  const props = {}, slots = {};
  const slotMap = Object.fromEntries(api.slots.map(slot => [slot.name.replace(/-([a-z])/g, (_,c)=>c.toUpperCase()),slot.name]));
  const propNames = new Set([...api.props, ...api.models].map(prop => prop.name));
  for (const [rawKey,value] of Object.entries(args)) {
    if (value === undefined || typeof value === 'function') continue;
    const key = rawKey.startsWith('default') ? rawKey.slice(7,8).toLowerCase()+rawKey.slice(8) : rawKey;
    if (key === 'children') slots.default = Array.isArray(value) ? value.map(plainText) : plainText(value);
    else if (slotMap[key] && !propNames.has(key)) slots[slotMap[key]] = plainText(value);
    else props[key] = value;
  }
  if(api.name === 'ImageView') props.src = 'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="green"/></svg>');
  // These are the common Vue/React/WC contracts (React additionally accepts value
  // for ButtonGroup options and an array tree, neither is the shared Vue API).
  if(api.name === 'FormButtonGroup') props.options = props.options.map(option=>({...option,key:option.value}));
  if(api.name === 'TreeList') props.tree = {label:'Documentation',children:{components:{label:'Components',children:{button:{label:'Button',children:{}}}},guides:{label:'Guides',children:{}}}};
  for(const key of Object.keys(slots)){
    const wrap = value => typeof value === 'string' ? {tag:'span',text:value} : value;
    slots[key] = Array.isArray(slots[key]) ? slots[key].map(wrap) : wrap(slots[key]);
  }
  return {name:api.name,props,slots,api};
});
`;

function createScenarios(samples) {
  const cases = [];
  for (const sample of samples) {
    for (const [id, width, dark] of [
      ["desktop", 800, false],
      ["dark", 800, true],
      ["mobile", 320, false],
    ]) {
      cases.push({ ...sample, id: `${sample.name}-${id}`, width, dark });
    }
    const properties = [...sample.api.props, ...sample.api.models];
    for (const property of properties) {
      if (
        [
          "disabled",
          "readonly",
          "active",
          "loading",
          "isLoading",
          "indeterminate",
        ].includes(property.name) &&
        property.type.includes("boolean")
      ) {
        cases.push({
          ...sample,
          id: `${sample.name}-${property.name}`,
          props: { ...sample.props, [property.name]: true },
        });
      }
      if (["size", "variant"].includes(property.name)) {
        const values = [...property.type.matchAll(/'([^']+)'/g)].map(
          (match) => match[1],
        );
        for (const value of values.filter(
          (value) => value !== sample.props[property.name],
        )) {
          cases.push({
            ...sample,
            id: `${sample.name}-${property.name}-${value}`,
            props: { ...sample.props, [property.name]: value },
          });
        }
      }
      if (
        ["error", "success"].includes(property.name) &&
        property.type.includes("string")
      ) {
        cases.push({
          ...sample,
          id: `${sample.name}-${property.name}`,
          props: {
            ...sample.props,
            [property.name]: `${property.name} message`,
          },
        });
      }
    }
  }
  for (const extra of extraScenarios) {
    const sample = samples.find((sample) => sample.name === extra.name);
    assert.ok(sample, `Unknown visual scenario component: ${extra.name}`);
    cases.push({
      ...sample,
      ...extra,
      props: { ...sample.props, ...extra.props },
      slots: { ...sample.slots, ...extra.slots },
    });
  }
  // Vue FormField exposes a scoped slot. Give its native input the same bindings
  // a consumer receives there; React and native WC apply these to the child.
  for (const scenario of cases.filter(
    (scenario) => scenario.name === "FormField",
  )) {
    const { props } = scenario;
    scenario.slots = {
      ...scenario.slots,
      default: {
        tag: "input",
        bindSlotProps: true,
        props: {
          id: props.id,
          value: props.value,
          placeholder: "Custom control",
        },
      },
    };
  }
  return cases;
}

async function compare(page, buffers) {
  return page.evaluate(
    async (inputs) => {
      const images = {},
        pixels = {},
        result = {};
      for (const [framework, src] of Object.entries(inputs)) {
        const image = new Image();
        image.src = src;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
        images[framework] = image;
        pixels[framework] = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        ).data;
      }
      for (const framework of ["react", "wc"]) {
        if (
          images[framework].width !== images.vue.width ||
          images[framework].height !== images.vue.height
        ) {
          throw new Error(
            `${framework} screenshot dimensions ${images[framework].width}x${images[framework].height} differ from Vue ${images.vue.width}x${images.vue.height}`,
          );
        }
        let differentPixels = 0;
        for (let index = 0; index < pixels.vue.length; index += 4) {
          // Ignore only tiny per-channel rasterization noise, not displaced pixels.
          if (
            Math.max(
              Math.abs(pixels.vue[index] - pixels[framework][index]),
              Math.abs(pixels.vue[index + 1] - pixels[framework][index + 1]),
              Math.abs(pixels.vue[index + 2] - pixels[framework][index + 2]),
            ) > 12
          )
            differentPixels++;
        }
        result[framework] = differentPixels;
      }
      return result;
    },
    Object.fromEntries(
      Object.entries(buffers).map(([framework, buffer]) => [
        framework,
        `data:image/png;base64,${buffer.toString("base64")}`,
      ]),
    ),
  );
}

async function main() {
  const { page, errors, close } = await boot({
    categories,
    additionalFixture: fixture,
    viewport: { width: 800, height: 700 },
  });
  const results = [];
  try {
    const samples = await page.evaluate(() => window.visualSamples);
    const sourceComponents = categories.flatMap((category) =>
      fs
        .readdirSync(
          path.join(__dirname, "../packages/library/src/components", category),
          { withFileTypes: true },
        )
        .filter(
          (entry) =>
            entry.isDirectory() &&
            fs.existsSync(
              path.join(
                __dirname,
                "../packages/library/src/components",
                category,
                entry.name,
                "index.vue",
              ),
            ),
        )
        .map((entry) => entry.name),
    );
    assert.deepEqual(
      samples.map((sample) => sample.name).sort(),
      sourceComponents.sort(),
      "Every public component must have a visual fixture",
    );
    // Keep calendar fixtures stable while letting Vue event timestamps advance.
    await page.clock.setSystemTime(new Date("2026-08-10T12:00:00.000Z"));
    const selected = process.env.VISUAL_COMPONENTS?.split(",");
    const selectedScenarios = process.env.VISUAL_SCENARIOS?.split(",");
    const scenarios = createScenarios(samples).filter(
      (scenario) =>
        (!selected || selected.includes(scenario.name)) &&
        (!selectedScenarios || selectedScenarios.includes(scenario.id)),
    );
    assert.ok(scenarios.length > 0, "No visual scenarios selected");
    for (const scenario of scenarios) {
      const beforeErrors = errors.length;
      const buffers = {};
      const result = { id: scenario.id, name: scenario.name };
      try {
        await page.setViewportSize({
          width: scenario.width || 800,
          height: 700,
        });
        for (const framework of ["vue", "react", "wc"]) {
          await page.mouse.move(0, 0);
          await page.evaluate((args) => window.display.mount(args), {
            name: scenario.name,
            props: scenario.props,
            slots: scenario.slots,
            framework,
          });
          await page.addStyleTag({
            content:
              "html{font-size:16px}body{margin:0}#root{padding:16px;min-height:700px}",
          });
          await page.evaluate((dark) => {
            document.body.classList.toggle("dark-mode", !!dark);
            document.documentElement.style.colorScheme = dark
              ? "dark"
              : "light";
            document.body.style.colorScheme = dark ? "dark" : "light";
            document.body.style.background = dark ? "#080d17" : "white";
          }, scenario.dark);
          if (scenario.name === "CommandPalette")
            await page.getByRole("combobox").focus();
          if (scenario.prepare) await scenario.prepare(page, framework);
          await page.waitForLoadState("networkidle");
          await page.evaluate(() => document.fonts.ready.then(() => undefined));
          await waitForFiniteAnimations(page.locator("body"));
          buffers[framework] = await captureStableScreenshot(page);
        }
        result.differences = await compare(page, buffers);
        assert.equal(errors.length - beforeErrors, 0, "Browser runtime error");
        assert.equal(
          result.differences.react,
          0,
          "React differs visually from Vue",
        );
        assert.equal(
          result.differences.wc,
          0,
          "Web Components differ visually from Vue",
        );
        result.status = "passed";
      } catch (error) {
        result.status = "failed";
        result.error = String(error);
        fs.mkdirSync(output, { recursive: true });
        for (const [framework, buffer] of Object.entries(buffers))
          fs.writeFileSync(
            path.join(output, `${scenario.id}-${framework}.png`),
            buffer,
          );
        console.error(
          `${scenario.id}: ${JSON.stringify(result.differences || result.error)}`,
        );
      }
      results.push(result);
      if (results.length % 30 === 0)
        console.log(
          `Visual parity: ${results.length}/${scenarios.length} scenarios checked`,
        );
    }
  } finally {
    await close();
    const failed = results.filter(
      (result) => result.status === "failed",
    ).length;
    fs.mkdirSync(path.dirname(report), { recursive: true });
    fs.writeFileSync(
      report,
      JSON.stringify(
        { engine, passed: results.length - failed, failed, errors, results },
        null,
        2,
      ) + "\n",
    );
    console.log(
      `Visual parity: ${results.length - failed}/${results.length} scenarios passed; ${errors.length} runtime errors; ${report}`,
    );
    if (failed || errors.length) process.exitCode = 1;
  }
}

module.exports = { compare, createScenarios };
if (require.main === module)
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

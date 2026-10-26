import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:4311";
const OUT = "qa/inspect";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
const errs = [];
page.on("console", (m) => {
  if (m.type() === "error") errs.push(m.text().slice(0, 160));
});
page.on("pageerror", (e) => errs.push("PAGEERROR: " + e.message));

await page.goto(BASE + "/robots/aegis", { waitUntil: "networkidle", timeout: 120000 });

const canvas = page.locator("canvas").first();
await canvas.scrollIntoViewIfNeeded();
await page.waitForTimeout(2500);

// the figure wrapping the canvas
const figure = page.locator("figure.plate").filter({ has: page.locator("canvas") }).first();
await figure.screenshot({ path: `${OUT}/canvas-default.png` });
console.log("captured canvas-default");

// click marker 2 (perception) in 3D — markers sit top-right of the model
const box = await canvas.boundingBox();
console.log("canvas box", JSON.stringify(box));

// Try clicking the tablist instead to confirm state change, then re-shoot 3D
const tabs = page.locator('[role="tab"]');
console.log("tabs:", await tabs.count());
await tabs.nth(1).click();
await page.waitForTimeout(900);
await figure.screenshot({ path: `${OUT}/canvas-perception.png` });

await tabs.nth(2).click();
await page.waitForTimeout(900);
await figure.screenshot({ path: `${OUT}/canvas-manipulation.png` });

await tabs.nth(0).click();
await page.waitForTimeout(900);

// orbit drag test — compare pixels before/after
const before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.5 + 150, box.y + box.height * 0.5 - 40, { steps: 12 });
await page.mouse.up();
await page.waitForTimeout(900);
const after = await canvas.screenshot();
fs.writeFileSync(`${OUT}/orbit-after.png`, after);
console.log("orbit changed pixels:", !before.equals(after));

console.log("errors:", errs.length ? errs : "none");
await browser.close();

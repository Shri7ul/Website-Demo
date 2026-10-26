import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:4310";
const OUT = "qa";
fs.mkdirSync(OUT, { recursive: true });

const pages = [
  ["home", "/"],
  ["robots", "/robots"],
  ["robot-aegis", "/robots/aegis"],
  ["robot-x1", "/robots/zugbee-x1"],
  ["research", "/research"],
  ["research-theme", "/research/mobility-over-rubble"],
  ["experiments", "/experiments"],
  ["experiment-detail", "/experiments/aegis-flipper-stair-ascent"],
  ["engineering", "/engineering"],
  ["journey", "/journey"],
  ["people", "/people"],
  ["resources", "/resources"],
  ["join", "/join"],
  ["collaborate", "/collaborate"],
  ["contact", "/contact"],
  ["content-status", "/content-status"],
];

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 390, height: 844 },
];

const problems = [];

const browser = await chromium.launch();

// ---------- warm up every route so dev compilation is not counted ----------
const warm = await browser.newPage();
for (const [, path] of pages) {
  try {
    await warm.goto(BASE + path, { waitUntil: "networkidle", timeout: 120000 });
  } catch (e) {
    problems.push(`WARMUP FAIL ${path}: ${e.message}`);
  }
}
await warm.close();

// ---------- screenshots + console errors + overflow ----------
for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();

  const consoleErrors = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => consoleErrors.push("PAGEERROR: " + e.message));

  for (const [name, path] of pages) {
    consoleErrors.length = 0;
    await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 120000 });
    await page.waitForTimeout(600);

    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      return {
        scrollW: de.scrollWidth,
        clientW: de.clientWidth,
        bodyScrollW: document.body.scrollWidth,
      };
    });
    if (overflow.scrollW > overflow.clientW + 1) {
      problems.push(
        `OVERFLOW ${vp.name} ${path}: scrollWidth ${overflow.scrollW} > client ${overflow.clientW}`
      );
    }
    if (consoleErrors.length) {
      problems.push(`CONSOLE ${vp.name} ${path}: ${consoleErrors.slice(0, 3).join(" | ")}`);
    }

    await page.screenshot({
      path: `${OUT}/${name}-${vp.name}.png`,
      fullPage: vp.name === "desktop",
    });
  }
  await ctx.close();
}

// ---------- 320px narrow check ----------
{
  const ctx = await browser.newContext({ viewport: { width: 320, height: 640 } });
  const page = await ctx.newPage();
  for (const [name, path] of pages) {
    await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 120000 });
    const o = await page.evaluate(() => ({
      s: document.documentElement.scrollWidth,
      c: document.documentElement.clientWidth,
    }));
    if (o.s > o.c + 1) problems.push(`OVERFLOW 320 ${path}: ${o.s} > ${o.c}`);
  }
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/home-320.png`, fullPage: true });
  await ctx.close();
}

await browser.close();

console.log("=== PROBLEMS ===");
if (problems.length === 0) console.log("none");
else problems.forEach((p) => console.log("• " + p));
console.log(`\nScreenshots in ${OUT}/`);

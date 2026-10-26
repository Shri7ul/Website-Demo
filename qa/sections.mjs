import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:4310";
const OUT = "qa/sections";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();

await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(1200);

// hero
await page.screenshot({ path: `${OUT}/01-hero.png` });

// each top-level section of main
const sections = await page.$$("main > section");
console.log("sections:", sections.length);

for (let i = 0; i < sections.length; i++) {
  await sections[i].scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/sec-${String(i + 1).padStart(2, "0")}.png` });
}

// mid-scrub position for scene 3
const scrub = await page.$("main > section:nth-of-type(3)");
if (scrub) {
  const box = await scrub.boundingBox();
  if (box) {
    await page.evaluate((y) => window.scrollTo(0, y), box.y + box.height * 0.45);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/03-scrub-mid.png` });
    await page.evaluate((y) => window.scrollTo(0, y), box.y + box.height * 0.8);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/03-scrub-late.png` });
  }
}

// 3D section
const canvas = await page.$("canvas");
if (canvas) {
  await canvas.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const el = await page.$("main > section:nth-of-type(5)");
  if (el) {
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/05-machine.png` });
  }
  const info = await page.evaluate(() => {
    const c = document.querySelector("canvas");
    if (!c) return null;
    return { w: c.width, h: c.height, cw: c.clientWidth, ch: c.clientHeight };
  });
  console.log("canvas:", JSON.stringify(info));
}

await browser.close();
console.log("done");

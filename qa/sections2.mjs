import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = "http://localhost:4311";
const OUT = "qa/sections";
mkdirSync(OUT, { recursive: true });

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

async function shot(url, name, opts = {}) {
  await page.goto(BASE + url, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
  });
  if (opts.scrollTo) {
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 90);
    }, opts.scrollTo);
  } else if (opts.y) {
    await page.evaluate((y) => window.scrollTo(0, y), opts.y);
  }
  await page.waitForTimeout(opts.wait ?? 700);
  if (opts.click) {
    await page.click(opts.click).catch(() => {});
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log("shot", name);
}

await shot("/", "01-hero");
await shot("/", "02-constraints", { scrollTo: "#constraints-heading" }).catch(async () => {
  await shot("/", "02-constraints", { y: 900 });
});
await shot("/", "03-timeline", { scrollTo: "#prototype-heading" });
await shot("/", "04-timeline-mid", { y: 3400 });
await shot("/", "05-evolution", { scrollTo: "#evolution-heading" });
await shot("/", "06-people", { y: 8200 });
await shot("/", "07-join", { y: 11800 });

await shot("/robots/aegis", "08-aegis-explorer", { scrollTo: "canvas" });
await shot("/robots/aegis", "09-aegis-explorer-perception", {
  scrollTo: "canvas",
  click: "#tab-perception",
});
await shot("/robots/aegis", "10-aegis-specs", { y: 2600 });

await shot("/engineering", "11-engineering-top");
await shot("/engineering", "12-engineering-decisions", { scrollTo: "#decisions" }).catch(async () => {
  await shot("/engineering", "12-engineering-decisions", { y: 2400 });
});
await shot("/journey", "13-journey");
await shot("/people", "14-people");
await shot("/experiments", "15-experiments");
await shot("/experiments", "16-experiments-filtered", { click: "#\\:R1\\:-form" }).catch(() => {});
await shot("/resources", "17-resources");
await shot("/join", "18-join");
await shot("/collaborate", "19-collaborate");
await shot("/contact", "20-contact");
await shot("/content-status", "21-content-status");

await b.close();

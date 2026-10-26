/**
 * Finds images that never finish loading in a real browser, then re-requests
 * the same optimizer URL with and without AVIF to isolate the cause.
 */
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:4311";
const ROUTES = [
  "/", "/robots", "/robots/aegis", "/robots/zugbee-x1",
  "/research", "/research/mobility-over-rubble",
  "/experiments", "/experiments/aegis-flipper-stair-ascent",
  "/engineering", "/journey", "/people", "/resources", "/join", "/collaborate", "/contact",
];

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const stuck = new Map();

for (const route of ROUTES) {
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
  });
  await page.waitForTimeout(2500);

  const bad = await page.evaluate(() =>
    [...document.images]
      .filter((i) => !i.complete || i.naturalWidth === 0)
      .map((i) => i.getAttribute("src") || "")
  );
  for (const u of bad) if (u) stuck.set(u, [...(stuck.get(u) ?? []), route]);
  console.log(`${route.padEnd(44)} images=${await page.locator("img").count()} notLoaded=${bad.length}`);
}

console.log(`\nDistinct stuck image URLs: ${stuck.size}`);
for (const [u, routes] of stuck) console.log(`  ${u}\n    ← ${routes.join(", ")}`);

// Isolate: AVIF vs WebP for each stuck URL.
for (const u of stuck.keys()) {
  const url = new URL(BASE + u);
  for (const accept of ["image/avif,image/webp,*/*", "image/webp,*/*"]) {
    const t = Date.now();
    const r = await fetch(url, { headers: { Accept: accept }, signal: AbortSignal.timeout(8000) }).catch((e) => ({ status: `TIMEOUT/ERR ${e.name}` }));
    console.log(`  ${accept.startsWith("image/avif") ? "AVIF" : "WEBP"} ${String(r.status).padEnd(12)} ${Date.now() - t}ms  w=${url.searchParams.get("w")} ${url.searchParams.get("url")}`);
  }
}

await b.close();

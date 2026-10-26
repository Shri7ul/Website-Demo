import { chromium } from "playwright";

const BASE = "http://localhost:4311";
const browser = await chromium.launch();
const results = [];
const ok = (n, p, d = "") => results.push({ n, p, d });

const routes = [
  "/", "/robots", "/robots/aegis", "/research", "/experiments",
  "/engineering", "/journey", "/people", "/resources", "/join",
  "/collaborate", "/contact",
];

/* ---------- reduced motion: nothing stays hidden ---------- */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const hidden = [];

  for (const r of routes) {
    await page.goto(BASE + r, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const bad = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll("[data-reveal], [data-reveal] *")) {
        const cs = getComputedStyle(el);
        const op = parseFloat(cs.opacity);
        if (op < 0.99 && el.getBoundingClientRect().height > 0) {
          out.push({
            tag: el.tagName.toLowerCase(),
            op: op.toFixed(2),
            text: (el.textContent || "").trim().slice(0, 40),
          });
        }
      }
      return out;
    });
    if (bad.length) hidden.push(`${r}: ${JSON.stringify(bad.slice(0, 2))}`);
  }
  ok("reduced-motion: no content left invisible", hidden.length === 0, hidden.join(" | ") || "clean");

  // the 3D canvas must still be present (static, not animated away)
  await page.goto(BASE + "/robots/aegis", { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  const canvasVisible = await page.evaluate(() => {
    const c = document.querySelector("canvas");
    if (!c) return false;
    const b = c.getBoundingClientRect();
    return b.width > 100 && b.height > 100;
  });
  ok("reduced-motion: 3D canvas still renders", canvasVisible);
  await ctx.close();
}

/* ---------- keyboard: skip link + focus visibility ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  await page.keyboard.press("Tab");
  const first = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      text: (el.textContent || "").trim().slice(0, 40),
      outline: cs.outlineStyle + " " + cs.outlineWidth,
      visible: r.top >= 0 && r.bottom <= window.innerHeight && r.width > 0,
    };
  });
  ok(
    "keyboard: first Tab reaches a visible skip link",
    !!first && /skip/i.test(first.text) && first.visible,
    JSON.stringify(first)
  );

  // focus ring must be non-none on a focusable control
  const ring = await page.evaluate(() => {
    const btn = document.querySelector("header a, header button");
    if (!btn) return "no control";
    btn.focus();
    const cs = getComputedStyle(btn);
    return `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`;
  });
  ok("keyboard: focus ring is drawn", !/none 0px/.test(ring), ring);
  await ctx.close();
}

/* ---------- every internal link resolves ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const seen = new Set();
  for (const r of routes) {
    await page.goto(BASE + r, { waitUntil: "networkidle" });
    const hrefs = await page.$$eval("a[href^='/']", (as) =>
      as.map((a) => a.getAttribute("href")).filter(Boolean)
    );
    hrefs.forEach((h) => seen.add(h.split("#")[0]));
  }
  const broken = [];
  for (const h of seen) {
    if (!h || h.startsWith("/assets")) continue;
    const res = await page.request.get(BASE + h);
    if (res.status() >= 400) broken.push(`${h} -> ${res.status()}`);
  }
  ok(
    `links: all ${seen.size} internal targets resolve`,
    broken.length === 0,
    broken.join(" | ") || "clean"
  );
  await ctx.close();
}

await browser.close();
let f = 0;
for (const r of results) {
  if (!r.p) f++;
  console.log(`${r.p ? "PASS" : "FAIL"}  ${r.n}${r.d ? "  ::  " + r.d : ""}`);
}
console.log(`\n${results.length - f}/${results.length} passed`);

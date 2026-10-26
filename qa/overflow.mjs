import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:4311";
const ROUTE = process.argv[3] || "/";
const W = +(process.argv[4] || 320);

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: W, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE + ROUTE, { waitUntil: "networkidle" });
await page.waitForTimeout(500);

const out = await page.evaluate(() => {
  const de = document.documentElement;
  const cw = de.clientWidth;
  const rows = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.right > cw + 1) {
      const path = [];
      let n = el;
      for (let i = 0; i < 5 && n && n !== document.body; i++) {
        path.unshift(
          n.tagName.toLowerCase() +
            (n.className && typeof n.className === "string"
              ? "." + n.className.trim().split(/\s+/).slice(0, 4).join(".")
              : "")
        );
        n = n.parentElement;
      }
      rows.push({
        sel: path.join(" > "),
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
        scrollW: el.scrollWidth,
        cs: (() => {
          const s = getComputedStyle(el);
          return `${s.position} w=${s.width} minw=${s.minWidth} disp=${s.display}`;
        })(),
      });
    }
  }
  return { cw, sw: de.scrollWidth, rows: rows.slice(0, 12) };
});

console.log("clientWidth", out.cw, "scrollWidth", out.sw);
for (const r of out.rows) console.log(`\n${r.sel}\n   left=${r.left} right=${r.right} w=${r.width} sw=${r.scrollW} | ${r.cs}`);
await b.close();

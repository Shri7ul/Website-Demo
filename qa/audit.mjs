/**
 * Full production audit: console, network, axe, headings, overflow, link graph.
 * Usage: node qa/audit.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const AXE = require.resolve("axe-core/axe.min.js");
const axeSource = readFileSync(AXE, "utf8");

const BASE = process.argv[2] || "http://localhost:4311";
const OUT = "qa/audit";
mkdirSync(OUT, { recursive: true });

const ROUTES = [
  "/",
  "/robots",
  "/robots/aegis",
  "/robots/zugbee-x1",
  "/research",
  "/research/mobility-over-rubble",
  "/research/mapping-in-degraded-environments",
  "/research/manipulation-in-confined-space",
  "/experiments",
  "/experiments/aegis-flipper-stair-ascent",
  "/experiments/zugbee-x1-outdoor-mobility",
  "/experiments/aegis-obstacle-rig-traverse",
  "/experiments/aegis-lidar-slam-drift",
  "/engineering",
  "/journey",
  "/people",
  "/resources",
  "/join",
  "/collaborate",
  "/contact",
  "/content-status",
  "/nonexistent-route",
];

const WIDTHS = [320, 375, 480, 768, 1024, 1280, 1536];

const browser = await chromium.launch();
const results = [];
const allLinks = new Map();

for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const failed = [];

  page.on("console", (m) => {
    if (m.type() === "error") {
      const t = m.text();
      // Resource failures are captured by the response/requestfailed listeners
      // with a URL attached; the console line adds no information.
      if (/GL Driver|ReadPixels|Autofill|Failed to load resource/i.test(t)) return;
      consoleErrors.push(t.slice(0, 400));
    }
  });
  page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 400)));
  page.on("requestfailed", (r) => {
    const u = r.url();
    if (/favicon|\.map$/.test(u)) return;
    // The 404 route is *supposed* to 404; that is the document itself.
    if (u === BASE + route) return;
    failed.push(`${r.failure()?.errorText} ${u}`);
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && r.url() !== BASE + route) failed.push(`HTTP ${r.status()} ${r.url()}`);
  });

  const resp = await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 45000 }).catch((e) => null);
  const status = resp ? resp.status() : 0;
  await page.waitForTimeout(350);

  // Walk the page so lazy images below the fold actually load before we
  // measure them. Without this every `loading="lazy"` image reports
  // naturalWidth 0 and looks broken.
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    await Promise.all(
      [...document.images].map((i) =>
        Promise.race([
          i.decode ? i.decode().catch(() => {}) : Promise.resolve(),
          new Promise((r) => setTimeout(r, 4000)),
        ])
      )
    );
  });
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(300);

  // axe
  let violations = [];
  try {
    await page.addScriptTag({ content: axeSource });
    const res = await page.evaluate(async () => {
      // @ts-ignore
      return await window.axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] },
      });
    });
    violations = res.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.length,
      sample: v.nodes.slice(0, 2).map((n) => n.target.join(" ")),
    }));
  } catch (e) {
    violations = [{ id: "axe-failed", impact: "unknown", help: String(e), nodes: 0, sample: [] }];
  }

  // headings
  const headings = await page.evaluate(() =>
    [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
      level: +h.tagName[1],
      text: (h.textContent || "").trim().slice(0, 70),
    }))
  );

  // images
  const imgs = await page.evaluate(() =>
    [...document.querySelectorAll("img")].map((i) => ({
      src: i.currentSrc || i.src,
      alt: i.getAttribute("alt"),
      w: i.naturalWidth,
    }))
  );

  // links
  const links = await page.evaluate(() =>
    [...document.querySelectorAll("a[href]")].map((a) => ({
      href: a.getAttribute("href"),
      text: (a.textContent || "").trim().slice(0, 60),
      target: a.getAttribute("target"),
    }))
  );
  for (const l of links) {
    if (!l.href) continue;
    const key = l.href;
    if (!allLinks.has(key)) allLinks.set(key, []);
    allLinks.get(key).push(route);
  }

  // overflow at each width
  const overflow = [];
  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(160);
    const o = await page.evaluate(() => {
      const de = document.documentElement;
      const over = de.scrollWidth - de.clientWidth;
      let culprits = [];
      if (over > 1) {
        culprits = [...document.querySelectorAll("body *")]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.right > de.clientWidth + 1;
          })
          .slice(0, 4)
          .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ").slice(0, 2).join(".")} right=${Math.round(el.getBoundingClientRect().right)}`);
      }
      return { over, culprits };
    });
    if (o.over > 1) overflow.push({ width: w, px: o.over, culprits: o.culprits });
  }

  results.push({ route, status, consoleErrors, pageErrors, failed, violations, headings, imgs, overflow, linkCount: links.length });
  console.log(
    `${String(status).padEnd(4)} ${route.padEnd(48)} axe=${violations.length} err=${consoleErrors.length + pageErrors.length} net=${failed.length} oflow=${overflow.length}`
  );
  await ctx.close();
}

await browser.close();

// ---- link graph ----
const internal = [...allLinks.keys()].filter((h) => h.startsWith("/") || h.startsWith(BASE));
const badLinks = [];
for (const href of internal) {
  const url = href.startsWith("http") ? href : BASE + href;
  const res = await fetch(url, { redirect: "follow" }).catch(() => null);
  const code = res ? res.status : 0;
  if (code >= 400) badLinks.push({ href, code, from: [...new Set(allLinks.get(href))] });
}

const summary = {
  base: BASE,
  auditedAt: new Date().toISOString(),
  routes: results.length,
  statusCodes: results.map((r) => ({ route: r.route, status: r.status })),
  totalConsoleErrors: results.reduce((a, r) => a + r.consoleErrors.length, 0),
  totalPageErrors: results.reduce((a, r) => a + r.pageErrors.length, 0),
  totalNetworkFailures: results.reduce((a, r) => a + r.failed.length, 0),
  totalOverflowCases: results.reduce((a, r) => a + r.overflow.length, 0),
  axeViolationCount: results.reduce((a, r) => a + r.violations.length, 0),
  axeByRule: Object.entries(
    results
      .flatMap((r) => r.violations)
      .reduce((acc, v) => {
        acc[v.id] = acc[v.id] || { impact: v.impact, help: v.help, nodes: 0, routes: new Set() };
        acc[v.id].nodes += v.nodes;
        return acc;
      }, {})
  ).map(([id, v]) => ({ id, ...v, routes: undefined })),
  internalLinksChecked: internal.length,
  badLinks,
  missingAlt: results.flatMap((r) => r.imgs.filter((i) => i.alt === null).map((i) => ({ route: r.route, src: i.src }))),
  brokenImages: results.flatMap((r) => r.imgs.filter((i) => i.w === 0).map((i) => ({ route: r.route, src: i.src }))),
};

writeFileSync(`${OUT}/audit.json`, JSON.stringify({ summary, results }, null, 2));

console.log("\n=== SUMMARY ===");
console.log("console errors:", summary.totalConsoleErrors);
console.log("page errors:", summary.totalPageErrors);
console.log("network failures:", summary.totalNetworkFailures);
console.log("overflow cases:", summary.totalOverflowCases);
console.log("axe violations:", summary.axeViolationCount);
console.log("internal links checked:", summary.internalLinksChecked, "| broken:", badLinks.length);
console.log("images missing alt:", summary.missingAlt.length, "| broken:", summary.brokenImages.length);
console.log("\naxe rules:");
for (const v of summary.axeByRule) console.log(`  ${v.impact} ${v.id} (${v.nodes}) — ${v.help}`);
if (badLinks.length) {
  console.log("\nbroken links:");
  for (const b of badLinks) console.log(`  ${b.code} ${b.href}  ← ${b.from.join(", ")}`);
}
for (const r of results) {
  if (r.consoleErrors.length || r.pageErrors.length || r.failed.length || r.overflow.length) {
    console.log(`\n${r.route}`);
    for (const e of r.consoleErrors) console.log("  console:", e);
    for (const e of r.pageErrors) console.log("  pageerror:", e);
    for (const e of r.failed) console.log("  net:", e);
    for (const o of r.overflow) console.log(`  overflow @${o.width}: +${o.px}px`, o.culprits);
  }
}

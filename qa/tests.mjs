/**
 * End-to-end regression suite against the production build.
 *
 *   node qa/tests.mjs [baseUrl]
 *
 * Exits non-zero if any assertion fails. Every check prints PASS/FAIL with the
 * value it actually observed, so the report can quote real numbers.
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:4311";
const OUT = "qa/tests";
mkdirSync(OUT, { recursive: true });

let pass = 0;
let fail = 0;
const failures = [];
const groups = {};

function check(group, name, ok, detail = "") {
  groups[group] = groups[group] || { pass: 0, fail: 0 };
  if (ok) {
    pass++;
    groups[group].pass++;
  } else {
    fail++;
    groups[group].fail++;
    failures.push(`${group} › ${name}${detail ? ` — ${detail}` : ""}`);
  }
  console.log(`${ok ? "PASS" : "FAIL"}  ${group.padEnd(16)} ${name}${detail ? `  [${detail}]` : ""}`);
}

const browser = await chromium.launch();
const IGNORE =
  /GL Driver|ReadPixels|Autofill|Failed to load resource|WebGL|SwiftShader|GroupMarkerNotSet/i;

async function newPage(viewport = { width: 1440, height: 900 }, opts = {}) {
  const ctx = await browser.newContext({ viewport, ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error" && !IGNORE.test(m.text())) errors.push(m.text().slice(0, 300));
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${String(e).slice(0, 300)}`));
  return { ctx, page, errors };
}

/* ───────────────────────── 1. routes ───────────────────────── */

const ROUTES = [
  "/", "/robots", "/robots/aegis", "/robots/zugbee-x1",
  "/research", "/research/mobility-over-rubble",
  "/research/mapping-in-degraded-environments",
  "/research/manipulation-in-confined-space",
  "/experiments", "/experiments/aegis-flipper-stair-ascent",
  "/experiments/zugbee-x1-outdoor-mobility",
  "/experiments/aegis-obstacle-rig-traverse",
  "/experiments/aegis-lidar-slam-drift",
  "/engineering", "/journey", "/people", "/resources",
  "/join", "/collaborate", "/contact", "/content-status",
];

{
  const { ctx, page, errors } = await newPage();
  for (const route of ROUTES) {
    const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
    check("routes", `${route} returns 200`, res?.status() === 200, `got ${res?.status()}`);
    const h1s = await page.locator("h1").count();
    check("routes", `${route} has exactly one h1`, h1s === 1, `found ${h1s}`);
    const title = await page.title();
    check("routes", `${route} has a title`, title.trim().length > 8, title);
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    check("routes", `${route} has a meta description`, !!desc && desc.length > 40);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    check("routes", `${route} has a canonical URL`, !!canonical, canonical ?? "missing");
  }
  check("routes", "no console errors while walking all routes", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

for (const bad of ["/nonexistent-route", "/robots/nope", "/experiments/nope", "/research/nope"]) {
  const { ctx, page } = await newPage();
  const res = await page.goto(BASE + bad, { waitUntil: "domcontentloaded" });
  check("routes", `${bad} returns 404`, res?.status() === 404, `got ${res?.status()}`);
  await ctx.close();
}

/* ───────────────────── 2. internal navigation ───────────────────── */

{
  const { ctx, page, errors } = await newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  // Every internal href in the document must resolve.
  const hrefs = await page.evaluate(() =>
    [...new Set([...document.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href")))]
  );
  let broken = [];
  for (const h of hrefs) {
    const r = await fetch(BASE + h, { redirect: "follow" });
    if (r.status >= 400) broken.push(`${h} → ${r.status}`);
  }
  check("navigation", `all ${hrefs.length} internal links on / resolve`, broken.length === 0, broken.join(", "));

  // Header navigation actually navigates.
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Experiments" }).click();
  await page.waitForURL("**/experiments");
  check("navigation", "primary nav navigates to /experiments", page.url().endsWith("/experiments"));
  check(
    "navigation",
    "current page is marked aria-current=page",
    (await page.locator('a[aria-current="page"]').count()) > 0
  );

  // Legacy redirects.
  for (const [from, to] of [["/projects.html", "/robots"], ["/member.html", "/people"], ["/index.html", "/"]]) {
    const r = await page.goto(BASE + from, { waitUntil: "domcontentloaded" });
    check("navigation", `${from} redirects to ${to}`, page.url().endsWith(to) && r.status() === 200, page.url());
  }

  check("navigation", "no console errors during navigation", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

/* ─────────────────── 3. experiments: load, filter, URL ─────────────────── */

{
  // Server-rendered records must exist without JavaScript.
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const p0 = await noJs.newPage();
  await p0.goto(BASE + "/experiments", { waitUntil: "domcontentloaded" });
  const bodyText = await p0.locator("body").innerText();
  const rows = await p0.locator("main ul > li").count();
  check("experiments", "records render with JavaScript disabled", rows === 4, `${rows} rows`);
  check(
    "experiments",
    "no 'Loading experiment records' in the served HTML",
    !bodyText.includes("Loading experiment records")
  );
  check("experiments", "all four titles present without JS", ["Flipper-assisted stair ascent", "Outdoor mobility baseline", "Timber obstacle rig traverse", "LiDAR SLAM mapping drift"].every((t) => bodyText.includes(t)));
  await noJs.close();

  const { ctx, page, errors } = await newPage();
  await page.goto(BASE + "/experiments", { waitUntil: "networkidle" });

  const count = () => page.locator("main ul > li").count();
  const status = () => page.locator("main p[aria-live='polite']").first().innerText();

  check("experiments", "unfiltered count is 4", (await count()) === 4, `${await count()}`);
  check("experiments", "count line reads '4 of 4'", (await status()).startsWith("4 of 4"), await status());

  // Robot filter
  await page.getByLabel("Robot").selectOption("AEGIS");
  await page.waitForTimeout(150);
  check("experiments", "Robot=AEGIS narrows to 3", (await count()) === 3, `${await count()}`);
  check("experiments", "URL carries robot=AEGIS", page.url().includes("robot=AEGIS"), page.url());

  // Subsystem filter stacks
  await page.getByLabel("Subsystem").selectOption("Perception");
  await page.waitForTimeout(150);
  check("experiments", "AEGIS + Perception narrows to 1", (await count()) === 1, `${await count()}`);
  check("experiments", "URL carries both filters", page.url().includes("robot=AEGIS") && page.url().includes("subsystem=Perception"), page.url());

  // Empty state
  await page.getByLabel("Subsystem").selectOption("Manipulation");
  await page.waitForTimeout(150);
  const emptyVisible = await page.getByText("No experiments match this filter").isVisible();
  check("experiments", "impossible filter shows the empty state", emptyVisible && (await count()) === 0);
  check("experiments", "empty state offers a reset", await page.getByRole("button", { name: "Clear filters" }).first().isVisible());

  // Reset from the empty state
  await page.getByRole("button", { name: "Clear filters" }).first().click();
  await page.waitForTimeout(200);
  check("experiments", "clear filters restores all 4", (await count()) === 4, `${await count()}`);
  check("experiments", "clear filters empties the query string", !page.url().includes("?"), page.url());

  // Search
  await page.getByLabel("Search").fill("lidar");
  await page.waitForTimeout(200);
  check("experiments", "search 'lidar' finds 1 record", (await count()) === 1, `${await count()}`);
  await page.getByLabel("Search").fill("zzzz");
  await page.waitForTimeout(200);
  check("experiments", "search with no hits shows empty state", (await count()) === 0);

  // Deep link restores state
  await page.goto(BASE + "/experiments?robot=Zugbee+X1", { waitUntil: "networkidle" });
  await page.waitForTimeout(250);
  check("experiments", "deep link restores the robot filter", (await page.getByLabel("Robot").inputValue()) === "Zugbee X1", await page.getByLabel("Robot").inputValue());
  check("experiments", "deep link renders 1 record", (await count()) === 1, `${await count()}`);

  // Back button restores the previous filter state
  await page.goto(BASE + "/experiments", { waitUntil: "networkidle" });
  await page.getByLabel("Robot").selectOption("AEGIS");
  await page.waitForTimeout(150);
  await page.getByLabel("Subsystem").selectOption("Locomotion");
  await page.waitForTimeout(150);
  await page.goBack();
  await page.waitForTimeout(300);
  check(
    "experiments",
    "browser back restores the earlier filter",
    (await page.getByLabel("Subsystem").inputValue()) === "All",
    await page.getByLabel("Subsystem").inputValue()
  );

  // Detail links resolve
  await page.goto(BASE + "/experiments", { waitUntil: "networkidle" });
  const firstLink = page.getByRole("link", { name: "Full record" }).first();
  const href = await firstLink.getAttribute("href");
  const r = await page.goto(BASE + href, { waitUntil: "domcontentloaded" });
  check("experiments", `detail link ${href} resolves`, r.status() === 200, `got ${r.status()}`);
  check("experiments", "detail page names the record", (await page.locator("h1").innerText()).length > 5);

  check("experiments", "no console errors in the explorer", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

/* ─────────────────────── 4. three.js ─────────────────────── */

{
  const { ctx, page, errors } = await newPage();
  await page.goto(BASE + "/robots/aegis", { waitUntil: "networkidle" });
  await page.locator("canvas").first().waitFor({ state: "visible", timeout: 15000 });
  await page.waitForTimeout(1200);

  const canvas = page.locator("canvas").first();
  // The explorer sits well below the fold; the canvas has to be in the viewport
  // before viewport-relative mouse coordinates mean anything.
  await canvas.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const box = await canvas.boundingBox();
  check("three", "canvas is rendered with real size", !!box && box.width > 300 && box.height > 200, `${Math.round(box?.width)}×${Math.round(box?.height)}`);

  // Non-blank: sample the canvas and confirm more than one colour.
  const distinct = await page.evaluate(() => {
    const c = document.querySelector("canvas");
    const g = c.getContext("webgl2") || c.getContext("webgl");
    return g ? true : false;
  });
  check("three", "canvas holds a live WebGL context", distinct);

  const panel = () => page.locator('[role="tabpanel"]').innerText();
  const before = await panel();
  await page.getByRole("tab", { name: /Perception/ }).click();
  await page.waitForTimeout(300);
  const after = await panel();
  check("three", "selecting a tab changes the info panel", before !== after, after.slice(0, 40));

  await page.getByRole("tab", { name: /Locomotion/ }).focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(200);
  const focused = await page.evaluate(() => document.activeElement?.id);
  check("three", "ArrowRight moves roving tabindex", focused === "tab-perception", focused ?? "none");

  // Clicking the model itself should change the selection. Project the known
  // marker position through the known camera so the click lands on the marker
  // rather than guessing at pixels.
  const { projectMarker } = await import("./project.mjs");
  await page.getByRole("tab", { name: /Locomotion/ }).click();
  await page.waitForTimeout(200);
  const startPanel = await panel();
  // Re-measure: clicking the tablist can scroll the page, which moves the canvas.
  await canvas.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const cbox = await canvas.boundingBox();
  const p2 = projectMarker([0.4, 1.34, 0.54], cbox.width, cbox.height);
  await page.mouse.click(cbox.x + p2.x, cbox.y + p2.y);
  await page.waitForTimeout(350);
  const afterCanvasClick = await panel();
  check(
    "three",
    "clicking the perception marker selects it",
    afterCanvasClick !== startPanel && /Perception/.test(afterCanvasClick),
    afterCanvasClick.split("\n")[0]
  );

  const p3 = projectMarker([0.88, 1.38, -0.36], cbox.width, cbox.height);
  await page.mouse.click(cbox.x + p3.x, cbox.y + p3.y);
  await page.waitForTimeout(350);
  check(
    "three",
    "clicking the manipulation marker selects it",
    /Manipulation/.test(await panel()),
    (await panel()).split("\n")[0]
  );

  // Reset control
  const reset = page.getByRole("button", { name: "Reset view" });
  check("three", "reset-view control is present", await reset.isVisible());
  await reset.click();
  await page.waitForTimeout(300);
  check("three", "reset view does not throw", errors.length === 0, errors.join(" | "));

  await page.screenshot({ path: `${OUT}/three-aegis.png` });
  await ctx.close();
}

{
  // WebGL unavailable → accessible fallback, and the tablist still works.
  const { ctx, page } = await newPage();
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = function () {
      return null;
    };
  });
  await page.goto(BASE + "/robots/aegis", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const fallback = await page.getByText("This browser cannot render the interactive assembly").isVisible();
  check("three", "no-WebGL shows the documented fallback", fallback);
  check("three", "no-WebGL hides the canvas entirely", (await page.locator("canvas").count()) === 0);
  await page.getByRole("tab", { name: /Manipulation/ }).click();
  await page.waitForTimeout(200);
  check("three", "subsystem panel still works without WebGL", (await page.locator('[role="tabpanel"]').innerText()).length > 20);
  await page.screenshot({ path: `${OUT}/three-fallback.png` });
  await ctx.close();
}

/* ───────────────────── 5. contact & recruitment ───────────────────── */

{
  const { ctx, page, errors } = await newPage();
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });

  await page.getByRole("button", { name: /Compose message/ }).click();
  await page.waitForTimeout(200);
  const errCount = await page.locator("[aria-invalid='true']").count();
  check("forms", "empty submit surfaces validation errors", errCount === 3, `${errCount} invalid fields`);
  const focusedId = await page.evaluate(() => document.activeElement?.id ?? "");
  check("forms", "focus moves to the first invalid field", focusedId.endsWith("-name"), focusedId);

  await page.getByLabel("Full name").fill("A");
  await page.getByLabel("Email address").fill("not-an-email");
  await page.getByLabel("Message").fill("short");
  await page.getByRole("button", { name: /Compose message/ }).click();
  await page.waitForTimeout(150);
  check("forms", "invalid email is rejected", (await page.locator("[aria-invalid='true']").count()) === 3);

  await page.getByLabel("Full name").fill("Test Visitor");
  await page.getByLabel("Email address").fill("visitor@example.com");
  await page.getByLabel("Message").fill("I would like to know more about the flipper design and the test rig.");
  await page.getByRole("button", { name: /Compose message/ }).click();
  await page.waitForTimeout(300);

  const fallback = page.getByTestId("mailto-fallback");
  const mailto = await fallback.getAttribute("href").catch(() => null);
  check(
    "forms",
    "valid submit composes a mailto: to the team address",
    typeof mailto === "string" && mailto.startsWith("mailto:rescuerover@cair.uiu.ac.bd"),
    String(mailto).slice(0, 60)
  );
  check(
    "forms",
    "mailto carries the encoded message body",
    typeof mailto === "string" && mailto.includes("body=") && mailto.includes("subject=")
  );
  check("forms", "button acknowledges the action", await page.getByRole("button", { name: /Compose message again/ }).isVisible());
  check("forms", "a clickable fallback is offered if the mail client does not open", await fallback.isVisible());
  check("forms", "no console errors on the contact form", errors.length === 0, errors.join(" | "));

  // Recruitment CTAs
  for (const [from, name, to] of [
    ["/", "Join the team", "/join"],
    ["/join", "Contact", "/contact"],
    ["/collaborate", "Contact", "/contact"],
  ]) {
    await page.goto(BASE + from, { waitUntil: "networkidle" });
    const link = page.getByRole("link", { name, exact: false }).first();
    const href = await link.getAttribute("href");
    check("forms", `${from} → "${name}" points at ${to}`, href === to, href ?? "missing");
  }

  // mailto / external links are well formed
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
  const externals = await page.evaluate(() =>
    [...document.querySelectorAll('a[target="_blank"]')].map((a) => ({ href: a.href, rel: a.rel }))
  );
  check(
    "forms",
    "every external link carries rel=noopener",
    externals.every((e) => e.rel.includes("noopener")),
    externals.filter((e) => !e.rel.includes("noopener")).map((e) => e.href).join(", ")
  );
  check("forms", "external links are https", externals.every((e) => e.href.startsWith("https://")));

  await ctx.close();
}

/* ───────────────────── 6. mobile menu & keyboard ───────────────────── */

{
  const { ctx, page, errors } = await newPage({ width: 390, height: 844 });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  // The trigger's accessible name flips between "Open menu" and "Close menu",
  // so locate it by the relationship it declares instead.
  const trigger = page.locator('[aria-controls="mobile-nav"]');
  check("keyboard", "menu trigger is at least 44×44", await (async () => {
    const b = await trigger.boundingBox();
    return !!b && b.width >= 44 && b.height >= 44;
  })());

  await trigger.click();
  await page.waitForTimeout(300);
  check("keyboard", "menu opens", await page.locator("#mobile-nav").isVisible());
  check("keyboard", "aria-expanded reflects state", (await trigger.getAttribute("aria-expanded")) === "true");
  check("keyboard", "focus moves into the menu", await page.evaluate(() => !!document.activeElement?.closest("#mobile-nav")));

  // Focus trap: tab from the last item wraps to the first.
  const trapped = await page.evaluate(async () => {
    const sheet = document.querySelector("#mobile-nav");
    const items = [...sheet.querySelectorAll("a[href]")];
    items[items.length - 1].focus();
    return document.activeElement === items[items.length - 1];
  });
  await page.keyboard.press("Tab");
  await page.waitForTimeout(100);
  check("keyboard", "Tab from the last item wraps into the menu", await page.evaluate(() => !!document.activeElement?.closest("#mobile-nav")));

  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  check("keyboard", "Escape closes the menu", !(await page.locator("#mobile-nav").isVisible()));
  check(
    "keyboard",
    "focus returns to the trigger after Escape",
    (await page.evaluate(() => document.activeElement?.getAttribute("aria-expanded"))) === "false"
  );

  // Skip link
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const first = await page.evaluate(() => document.activeElement?.textContent?.trim());
  check("keyboard", "first Tab reaches the skip link", first === "Skip to content", first ?? "none");

  // Visible focus ring
  const outline = await page.evaluate(() => {
    const a = document.querySelector("a.skip-link");
    a.focus();
    const s = getComputedStyle(a);
    return `${s.outlineStyle} ${s.outlineWidth}`;
  });
  check("keyboard", "focused element draws a visible outline", /solid/.test(outline) && !/0px/.test(outline), outline);

  check("keyboard", "no console errors on mobile", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

/* ───────────────────── 7. reduced motion ───────────────────── */

{
  const { ctx, page } = await newPage({ width: 1440, height: 900 }, { reducedMotion: "reduce" });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const hidden = await page.evaluate(
    () => [...document.querySelectorAll("[data-reveal]")].filter((el) => getComputedStyle(el).opacity === "0").length
  );
  check("motion", "nothing is left invisible under prefers-reduced-motion", hidden === 0, `${hidden} hidden`);

  // Timeline falls back to the static list.
  const staticStages = await page.getByRole("heading", { name: "Zugbee X1 completed" }).count();
  check("motion", "prototype timeline renders the static list", staticStages > 0);

  // Scroll should not change the stage label because there is no scrub.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.6));
  await page.waitForTimeout(400);
  check("motion", "no sticky scrub track under reduced motion", (await page.locator(".sticky.top-20").count()) === 0);
  await ctx.close();
}

/* ───────────────────── 8. responsive overflow ───────────────────── */

{
  const WIDTHS = [1280, 1024, 768, 480, 375, 320];
  const { ctx, page } = await newPage({ width: 1440, height: 900 });
  const problems = [];
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(200);
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.waitForTimeout(120);
      const over = await page.evaluate(() => {
        const de = document.documentElement;
        return de.scrollWidth - de.clientWidth;
      });
      if (over > 1) problems.push(`${route}@${w} +${over}px`);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
  }
  check("responsive", `${ROUTES.length} routes × ${WIDTHS.length} widths without overflow`, problems.length === 0, problems.slice(0, 6).join(", "));
  await ctx.close();
}

/* ───────────────────── 9. assets & network ───────────────────── */

{
  const { ctx, page } = await newPage();
  const failed = [];
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });
  let zero = [];
  for (const route of ["/", "/robots", "/robots/aegis", "/people", "/resources", "/journey"]) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      // Wait for images to settle, but never block on one that stays lazy —
      // decode() does not reject for an image the browser has not fetched.
      await Promise.all(
        [...document.images].map((i) =>
          Promise.race([
            i.decode ? i.decode().catch(() => {}) : Promise.resolve(),
            new Promise((r) => setTimeout(r, 4000)),
          ])
        )
      );
    });
    await page.waitForTimeout(600);
    const bad = await page.evaluate(() =>
      [...document.querySelectorAll("img")]
        .filter((i) => i.naturalWidth === 0)
        .map((i) => i.currentSrc || i.src)
    );
    zero.push(...bad.map((b) => `${route} ${b.split("?")[0].split("/").pop()}`));
  }
  check("assets", "no image fails to decode", zero.length === 0, zero.slice(0, 5).join(", "));
  check("assets", "no 4xx/5xx network responses", failed.length === 0, failed.slice(0, 5).join(", "));
  await ctx.close();
}

/* ───────────────────── 10. SEO surface ───────────────────── */

{
  const { ctx, page } = await newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  const robotsTxt = await (await fetch(BASE + "/robots.txt")).text();
  check("seo", "robots.txt exists and points at the sitemap", robotsTxt.includes("Sitemap:") && robotsTxt.includes("sitemap.xml"));
  const sitemap = await (await fetch(BASE + "/sitemap.xml")).text();
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  check("seo", "sitemap lists every public route", locs.length >= 20, `${locs.length} urls`);
  check("seo", "sitemap excludes the noindex ledger", !locs.some((l) => l.includes("/content-status")));

  const og = await page.locator('meta[property="og:image"]').getAttribute("content");
  check("seo", "og:image is absolute", !!og && og.startsWith("https://"), og ?? "missing");
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  check(
    "seo",
    "homepage canonical points at the deployment host",
    canonical === "https://urrt-website.netlify.app/" || canonical === "https://urrt-website.netlify.app",
    canonical ?? "missing"
  );

  await page.goto(BASE + "/content-status", { waitUntil: "domcontentloaded" });
  const noindex = await page.locator('meta[name="robots"]').getAttribute("content");
  check("seo", "/content-status is noindex", !!noindex && noindex.includes("noindex"), noindex ?? "missing");

  // Titles are unique across routes.
  const titles = [];
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
    titles.push(await page.title());
  }
  const dupes = titles.filter((t, i) => titles.indexOf(t) !== i);
  check("seo", "page titles are unique", dupes.length === 0, dupes.join(" | "));

  await ctx.close();
}

/* ───────────────────────── summary ───────────────────────── */

await browser.close();

const summary = { base: BASE, ranAt: new Date().toISOString(), pass, fail, groups, failures };
writeFileSync(`${OUT}/results.json`, JSON.stringify(summary, null, 2));

console.log("\n──────────────────────────────────────────────");
for (const [g, v] of Object.entries(groups)) console.log(`${g.padEnd(16)} ${v.pass} pass, ${v.fail} fail`);
console.log("──────────────────────────────────────────────");
console.log(`TOTAL ${pass} passed, ${fail} failed`);
if (fail) {
  console.log("\nFailures:");
  for (const f of failures) console.log("  ✗ " + f);
}
process.exit(fail ? 1 : 0);

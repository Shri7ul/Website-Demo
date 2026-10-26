import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:4311";
const OUT = "qa/interact";
fs.mkdirSync(OUT, { recursive: true });

const results = [];
const ok = (name, pass, detail = "") =>
  results.push({ name, pass, detail });

const browser = await chromium.launch();

/* ==========================================================================
   1. Timeline scrub — does "Stage N of 3" actually advance with scroll?
   ========================================================================== */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(1500);

  const hasScrub = await page.locator("text=/Stage \\d+ of \\d+/").count();
  ok("timeline: scrub UI present at 1440px", hasScrub > 0, `found ${hasScrub}`);

  if (hasScrub) {
    const wrapperTop = await page.evaluate(() => {
      const label = [...document.querySelectorAll("p")].find((p) =>
        /Stage \d+ of \d+/.test(p.textContent || "")
      );
      if (!label) return null;
      let el = label;
      while (el && el !== document.body) {
        const h = el.getBoundingClientRect().height;
        if (h > window.innerHeight * 1.5) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          return { top, height: h };
        }
        el = el.parentElement;
      }
      return null;
    });

    if (wrapperTop) {
      const seen = [];
      for (const f of [0.02, 0.3, 0.55, 0.8, 0.97]) {
        await page.evaluate(
          (y) => window.scrollTo(0, y),
          wrapperTop.top + wrapperTop.height * f
        );
        await page.waitForTimeout(700);
        const t = await page
          .locator("p", { hasText: /Stage \d+ of \d+/ })
          .first()
          .textContent();
        seen.push(`@${f}: ${t?.trim()}`);
        if (f === 0.55) {
          await page.screenshot({ path: `${OUT}/timeline-mid.png` });
        }
      }
      const distinct = new Set(seen.map((s) => s.split(": ")[1])).size;
      ok("timeline: stage advances with scroll", distinct >= 3, seen.join(" | "));
    } else {
      ok("timeline: stage advances with scroll", false, "wrapper not found");
    }
  }
  await ctx.close();
}

/* ==========================================================================
   2. 3D hotspot click — does clicking a marker change the tab panel?
   ========================================================================== */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/robots/aegis", { waitUntil: "networkidle", timeout: 120000 });
  const canvas = page.locator("canvas").first();
  await canvas.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);

  const before = await page.locator('[role="tabpanel"] h3').first().textContent();
  const box = await canvas.boundingBox();

  // marker 2 sits ~0.4 up-right of centre; probe a small grid for a hit
  let changed = false;
  let hitAt = "";
  const probes = [
    [0.46, 0.2], [0.44, 0.16], [0.5, 0.24], [0.42, 0.22],
    [0.86, 0.1], [0.88, 0.14], [0.84, 0.08], [0.9, 0.12],
  ];
  for (const [px, py] of probes) {
    await page.mouse.click(box.x + box.width * px, box.y + box.height * py);
    await page.waitForTimeout(450);
    const now = await page.locator('[role="tabpanel"] h3').first().textContent();
    if (now !== before) {
      changed = true;
      hitAt = `(${px},${py}) -> ${now?.trim()}`;
      break;
    }
  }
  ok("3D: clicking a marker changes the panel", changed, hitAt || "no probe hit a marker");

  // keyboard: arrow keys move the tab selection
  await page.locator('[role="tab"]').first().focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(300);
  const selected = await page
    .locator('[role="tab"][aria-selected="true"]')
    .first()
    .textContent();
  ok(
    "3D: ArrowRight moves tab selection",
    /Perception/i.test(selected || ""),
    (selected || "").trim().slice(0, 40)
  );

  await page.screenshot({ path: `${OUT}/aegis-3d.png` });
  await ctx.close();
}

/* ==========================================================================
   3. Mobile navigation — open, focus trap, Escape, focus restore
   ========================================================================== */
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(800);

  const trigger = page.locator('header button[aria-expanded]').first();
  const hasTrigger = (await trigger.count()) > 0;
  ok("nav: mobile menu trigger exists", hasTrigger);

  if (hasTrigger) {
    await trigger.click();
    await page.waitForTimeout(500);
    const expanded = await trigger.getAttribute("aria-expanded");
    ok("nav: opens with aria-expanded=true", expanded === "true", String(expanded));
    await page.screenshot({ path: `${OUT}/mobile-nav-open.png` });

    // Tab 14 times and confirm focus never leaves the dialog/header
    let escaped = false;
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return false;
        return !!el.closest("header, [role='dialog'], #site-menu");
      });
      if (!inside) {
        escaped = true;
        break;
      }
    }
    ok("nav: focus stays trapped while open", !escaped);

    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    const afterEsc = await trigger.getAttribute("aria-expanded");
    ok("nav: Escape closes the menu", afterEsc === "false", String(afterEsc));

    const focusRestored = await page.evaluate(() => {
      const el = document.activeElement;
      return !!el && el.tagName === "BUTTON" && el.hasAttribute("aria-expanded");
    });
    ok("nav: focus returns to the trigger", focusRestored);
  }
  await ctx.close();
}

/* ==========================================================================
   4. Reduced motion — no scrub, static list, no 3D auto-animation
   ========================================================================== */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(1500);
  const scrub = await page.locator("text=/Stage \\d+ of \\d+/").count();
  const headings = await page.locator("article h3").count();
  ok(
    "reduced-motion: timeline falls back to static list",
    scrub === 0 && headings >= 3,
    `scrub=${scrub} articles=${headings}`
  );
  await page.screenshot({ path: `${OUT}/reduced-motion-journey.png` });
  await ctx.close();
}

/* ==========================================================================
   5. 320px — no horizontal overflow anywhere
   ========================================================================== */
{
  const ctx = await browser.newContext({ viewport: { width: 320, height: 720 } });
  const page = await ctx.newPage();
  const routes = [
    "/", "/robots", "/robots/aegis", "/robots/zugbee-x1", "/research",
    "/research/mobility-over-rubble", "/experiments",
    "/experiments/aegis-flipper-stair-ascent", "/engineering", "/journey",
    "/people", "/resources", "/join", "/collaborate", "/contact", "/content-status",
  ];
  const overflow = [];
  for (const r of routes) {
    await page.goto(BASE + r, { waitUntil: "networkidle", timeout: 120000 });
    await page.waitForTimeout(600);
    const res = await page.evaluate(() => {
      const de = document.documentElement;
      const over = de.scrollWidth - de.clientWidth;
      let worst = null;
      if (over > 1) {
        for (const el of document.querySelectorAll("body *")) {
          const b = el.getBoundingClientRect();
          if (b.right > de.clientWidth + 1 && b.width > 0) {
            const cur = worst?.w ?? 0;
            if (b.width > cur)
              worst = {
                w: Math.round(b.width),
                tag: el.tagName.toLowerCase(),
                cls: (el.className || "").toString().slice(0, 60),
              };
          }
        }
      }
      return { over, worst };
    });
    if (res.over > 1) overflow.push(`${r} +${res.over}px ${JSON.stringify(res.worst)}`);
  }
  ok("320px: no horizontal overflow", overflow.length === 0, overflow.join(" | ") || "clean");
  await ctx.close();
}

await browser.close();

let fails = 0;
for (const r of results) {
  if (!r.pass) fails++;
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? "  ::  " + r.detail : ""}`);
}
console.log(`\n${results.length - fails}/${results.length} passed`);

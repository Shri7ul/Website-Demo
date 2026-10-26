import { chromium } from "playwright";

const BASE = "http://localhost:4311";

const routes = [
  "/",
  "/robots",
  "/robots/aegis",
  "/robots/zugbee-x1",
  "/research",
  "/research/mobility-over-rubble",
  "/experiments",
  "/experiments/aegis-flipper-stair-ascent",
  "/engineering",
  "/journey",
  "/people",
  "/resources",
  "/join",
  "/collaborate",
  "/contact",
  "/content-status",
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

for (const route of routes) {
  const page = await ctx.newPage();
  const events = [];

  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") {
      events.push({ kind: m.type(), text: m.text(), loc: m.location() });
    }
  });
  page.on("pageerror", (e) => {
    events.push({
      kind: "pageerror",
      text: e.message,
      stack: (e.stack || "").split("\n").slice(0, 8).join("\n"),
    });
  });
  page.on("requestfailed", (r) => {
    events.push({ kind: "reqfail", text: `${r.url()} :: ${r.failure()?.errorText}` });
  });

  try {
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 120000 });
    await page.waitForTimeout(2500);
  } catch (e) {
    events.push({ kind: "nav", text: e.message });
  }

  if (events.length) {
    console.log(`\n=== ${route} ===`);
    for (const ev of events) {
      console.log(`  [${ev.kind}] ${ev.text}`);
      if (ev.loc && ev.loc.url) console.log(`      at ${ev.loc.url}:${ev.loc.lineNumber}`);
      if (ev.stack) console.log(ev.stack.split("\n").map((l) => "      " + l).join("\n"));
    }
  } else {
    console.log(`=== ${route} === clean`);
  }

  await page.close();
}

await browser.close();

/**
 * Lighthouse against the production build.
 * Usage: node qa/lighthouse.mjs [baseUrl] [route...]
 */
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:4311";
const ROUTES = process.argv.slice(3);
const TARGETS = ROUTES.length ? ROUTES : ["/", "/robots/aegis", "/experiments", "/people"];

const CHROME = chromium.executablePath();
mkdirSync("qa/lighthouse", { recursive: true });

const chrome = await chromeLauncher.launch({
  chromePath: CHROME,
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});

const results = [];

for (const route of TARGETS) {
  for (const preset of ["mobile", "desktop"]) {
    const runnerResult = await lighthouse(
      BASE + route,
      {
        port: chrome.port,
        output: "json",
        logLevel: "error",
        screenEmulation:
          preset === "mobile"
            ? { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false }
            : { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
        formFactor: preset,
        throttling:
          preset === "mobile"
            ? { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4, requestLatencyMs: 562.5, downloadThroughputKbps: 1474.56, uploadThroughputKbps: 675 }
            : { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1, requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0 },
      },
      {
        extends: "lighthouse:default",
        settings: { onlyCategories: ["performance", "accessibility", "best-practices", "seo"] },
      }
    );

    const c = runnerResult.lhr.categories;
    const row = {
      route,
      preset,
      performance: Math.round(c.performance.score * 100),
      accessibility: Math.round(c.accessibility.score * 100),
      bestPractices: Math.round(c["best-practices"].score * 100),
      seo: Math.round(c.seo.score * 100),
      lcp: runnerResult.lhr.audits["largest-contentful-paint"].displayValue,
      cls: runnerResult.lhr.audits["cumulative-layout-shift"].displayValue,
      tbt: runnerResult.lhr.audits["total-blocking-time"].displayValue,
      fcp: runnerResult.lhr.audits["first-contentful-paint"].displayValue,
      // anything scoring below 1, so regressions are traceable
      opportunities: Object.values(runnerResult.lhr.audits)
        .filter((a) => a.score !== null && a.score < 1 && a.details?.type === "opportunity")
        .map((a) => `${a.id}: ${a.displayValue ?? ""}`)
        .slice(0, 6),
    };
    results.push(row);
    console.log(
      `${route.padEnd(26)} ${preset.padEnd(8)} perf=${String(row.performance).padStart(3)} a11y=${String(row.accessibility).padStart(3)} bp=${String(row.bestPractices).padStart(3)} seo=${String(row.seo).padStart(3)}  LCP ${row.lcp}  CLS ${row.cls}  TBT ${row.tbt}`
    );
    writeFileSync(
      `qa/lighthouse/${route.replace(/\W+/g, "_") || "home"}-${preset}.json`,
      JSON.stringify(runnerResult.lhr, null, 2)
    );
  }
}

writeFileSync("qa/lighthouse/summary.json", JSON.stringify(results, null, 2));
await chrome.kill();

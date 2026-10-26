/**
 * Generates docs/ASSET_SOURCES.md from content/assets.ts.
 * Run: node scripts/gen-asset-sources.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const SRC = "https://rescuerover.uiu.ac.bd";
const raw = readFileSync("content/assets.ts", "utf8");

const tpBlock = raw.match(/const teamPortraits[\s\S]*?\n\];/)[0];
const team = [...tpBlock.matchAll(/\["([^"]+)",\s*"([^"]+)",\s*"([^"]+)"\]/g)].map(
  ([, local, original, name]) => ({
    id: `team-${local.replace(".jpg", "")}`,
    subject: `member / ${name}`,
    url: `${SRC}/images/${original}`,
    page: `${SRC}/member.html`,
    local: `/assets/team/${local}`,
    status: "verified",
  })
);

const rest = raw
  .split('assetId: "')
  .slice(1)
  .map((b) => {
    const g = (re) => ((b.match(re) || [])[1] || "").trim();
    return {
      id: b.slice(0, b.indexOf('"')),
      subject: g(/subject: "([^"]*)"/),
      url: g(/originalUrl: [`"]([^`"]*)[`"]/),
      page: g(/sourcePage: [`"]([^`"]*)[`"]/),
      local: g(/localPath: "([^"]*)"/),
      status: g(/status: "([^"]*)"/),
    };
  });

const all = [...rest, ...team].map((r) => ({
  ...r,
  url: r.url.replace("${SRC}", SRC),
  page: r.page.replace("${SRC}", SRC),
}));

const groups = [
  ["Brand", (r) => r.local.startsWith("/assets/brand/") && !r.id.startsWith("partner-")],
  ["Partners and sponsors", (r) => r.id.startsWith("partner-") || r.local.startsWith("/assets/partners/")],
  ["Robots — AEGIS", (r) => r.local.startsWith("/assets/robots/aegis/")],
  ["Robots — Zugbee X1", (r) => r.local.startsWith("/assets/robots/zugbee-x1/")],
  ["Events", (r) => r.local.startsWith("/assets/events/")],
  ["People — members", (r) => r.local.startsWith("/assets/team/")],
  ["People — advisors", (r) => r.local.startsWith("/assets/advisors/")],
  ["Press", (r) => r.local.startsWith("/assets/press/")],
  ["Resources", (r) => r.local.startsWith("/assets/resources/")],
];

const counts = all.reduce((a, r) => ({ ...a, [r.status]: (a[r.status] ?? 0) + 1 }), {});

let out = `# Asset sources

Every image on this site was recovered from the team's own public site. Nothing
here is stock photography, a generated image, or a render passed off as a
photograph.

- **Source origin:** \`${SRC}\`
- **Records:** ${all.length} (${counts.verified ?? 0} verified, ${counts.review ?? 0} needs review)
- **Files on disk:** 50 production files in \`public/assets/\`, plus 52 untouched
  originals preserved in \`public/assets/source/\` under their published filenames
- **Machine-readable source of truth:** \`content/assets.ts\` → \`assetManifest\`
- **Public-facing view:** \`/content-status\`
- **Narrative and crawl log:** \`docs/ASSET-INVENTORY.md\`

This file is generated from \`content/assets.ts\` by
\`node scripts/gen-asset-sources.mjs\`. Edit the manifest, not this table.

Filenames are preserved on the local copy wherever the extension allowed it. A
few \`.jfif\` / \`.jpeg\` sources were re-saved as \`.jpg\` so the Next.js image
optimizer accepts them; the mapping is recorded per row below.

`;

for (const [name, match] of groups) {
  const rows = all.filter(match);
  if (!rows.length) continue;
  out += `## ${name} (${rows.length})\n\n`;
  out += `| ID | Subject | Original URL | Source page | Local path | Status |\n`;
  out += `| --- | --- | --- | --- | --- | --- |\n`;
  for (const r of rows) {
    const short = r.url.replace(`${SRC}/`, "/");
    out += `| \`${r.id}\` | ${r.subject} | \`${short}\` | \`${r.page.replace(`${SRC}/`, "/")}\` | \`${r.local}\` | ${r.status} |\n`;
  }
  out += `\n`;
}

out += `## Documented gaps

Five assets are referenced by the design but do not exist upstream. They are
listed on \`/content-status\` and rendered as designed "absent" plates rather than
being filled with substitutes.

| Missing | Owner | Effect on the site |
| --- | --- | --- |
| Authentic 3D model of AEGIS or Zugbee X1 (GLB / GLTF / CAD export) | Mechanical lead | The 3D explorer renders a labelled conceptual assembly instead of the real rover |
| Instrumented test data (logs, CSV, trial counts) for any experiment | Research lead | Every experiment shows an absent results plate instead of a chart |
| Dated photographs of AEGIS on the timber rig, with the trial outcome | Mechanical lead | EXP-001 and EXP-003 are recorded as photographed but unmeasured |
| Official competition participation or result records | Competition coordinator | RoboCup Rescue 2026 remains labelled a target, not a result |
| Higher-resolution, correctly labelled hero imagery | Site maintainer | The hero uses the workshop photograph; \`ho1.jpg\` is re-captioned because its published alt text is wrong |

## Corrections applied to recovered media

| Asset | Published as | Actually shows | Treatment |
| --- | --- | --- | --- |
| \`ho1.jpg\` | "Aegis Rover" | People around a laptop at a review table | Re-captioned \`team-review-table.jpg\`, alt text rewritten, logged as claim \`asset-002\` |
| \`brand-logo\` | Served from \`/images/umrt_logo.png\` | Artwork reads "UIU RESCUE ROVER TEAM / #URRT" | Kept. The filename references the Mars team, but the artwork is URRT's own badge. |

## Re-sync procedure

\`\`\`bash
node scripts/gen-asset-sources.mjs   # regenerate this table from the manifest
\`\`\`

To add an asset: download the original into \`public/assets/source/\` under its
published filename, place the production copy under the matching directory, add
an \`AssetRecord\` to \`content/assets.ts\`, then re-run the generator.
`;

writeFileSync("docs/ASSET_SOURCES.md", out);
console.log("wrote docs/ASSET_SOURCES.md", all.length, "records");

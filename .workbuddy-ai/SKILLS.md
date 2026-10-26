# Installed Skills — Provenance

Project-level skills live in `.workbuddy-ai/skills/<skill-name>/SKILL.md`.
Installed from three upstream repositories on 2026-10-26.

## Sources

| Upstream repo | Commit | Commit date | Skills | Installed as |
|---|---|---|---|---|
| `cesartevisual/threejs-skills` | `84f9bcb` | 2026-09-10 | 24 | `threejs-*` |
| `dinaf2026-web/awesome-web-skills` | `d7b90db` | 2026-06-13 | 15 | `web-*` |
| `amrrs/cinematic-webscroll-frontend-skill` | `dd60273` | 2026-03-30 | 1 | `cinematic-web-experiences` |

Total: 40 skills.

## Local modifications applied during install

These deviate from upstream — re-apply them if you re-sync:

1. `cinematic-web-experiences` was taken from the repo's `.codex/` variant.
   Its two references to `../../../shared/cinematic-web-experiences/guide.md`
   (outside the skill dir) were repointed:
   - `SKILL.md` -> `references/canonical-guide.md`
   - `references/guide.md` -> `canonical-guide.md`
   The upstream 12 KB canonical guide was copied to
   `references/canonical-guide.md` so the skill is self-contained.
2. `cinematic-web-experiences/SKILL.md` description: removed the
   "Use when Codex needs to..." phrasing so it triggers in any host.
3. `web-analytics`, `web-copywriting`, `web-maps`: stripped a UTF-8 BOM that
   preceded the opening `---` and broke frontmatter parsing.
4. `web-auth`: collapsed a YAML folded scalar (`description: >`) into a single
   line for loaders that parse frontmatter line-by-line.

## Re-sync

```bash
git clone --depth 1 https://github.com/<owner>/<repo>.git /tmp/sync
cp -r /tmp/sync/skills/. .workbuddy-ai/skills/
# then re-apply modifications 1-4 above
```

## Note

The `threejs-skills` pack pins `three@0.136.0` in some guidance, and
`cinematic-web-experiences` explicitly requires `three@0.136.0` +
`@types/three@0.136.0`. That is an old revision — check against whatever
Three.js version this project actually uses before following those pins.

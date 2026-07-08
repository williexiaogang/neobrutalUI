# Reports

This directory holds project reports. Only manually-curated reports should be committed; generated artifacts live in `generated/` and are ignored by git.

## Canonical audit report

- **`component-audit-list.md`** — The single source of truth for the current state of all 59 components. It tracks status (`ready` / `beta` / `in-progress`), CSS ownership, demo wiring, interaction modules, API docs, and known issues. Always update this file when a component's status or gaps change.

## Other tracked files

- `api-snapshot.json` — API surface snapshot produced by `scripts/snapshot-api.mjs`.
- `bundle-size.json` — Bundle-size baseline produced by `scripts/check-bundle-size.mjs`.

## Generated reports

The following scripts write their output to `reports/generated/` (created on demand, ignored by git):

| Script | Output |
|--------|--------|
| `scripts/build-all.mjs` | `generated/build-report.md` |
| `scripts/test-a11y.mjs` | `generated/a11y-report.json` |
| `scripts/test-acceptance.mjs` | `generated/acceptance-report.md` |
| `scripts/verify-css.mjs` | `generated/verify-report.md` |

If you need the latest generated numbers, run the relevant script and inspect the output in `reports/generated/`.

import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const target = process.argv[2];

async function ensureParent(file) {
  await mkdir(dirname(file), { recursive: true });
}

async function copy(source, destination) {
  await ensureParent(destination);
  await copyFile(source, destination);
}

async function write(destination, content) {
  await ensureParent(destination);
  await writeFile(destination, content);
}

switch (target) {
  case "core": {
    const source = resolve(root, "packages/core/src/index.css");
    const dist = resolve(root, "packages/core/dist");

    await copy(source, resolve(dist, "index.css"));
    await copy(source, resolve(dist, "tokens.css"));
    await copy(source, resolve(dist, "base.css"));
    await copy(source, resolve(dist, "components.css"));
    await copy(source, resolve(dist, "utilities.css"));
    break;
  }

  case "interactions": {
    const source = resolve(root, "packages/interactions/src/index.js");
    const dist = resolve(root, "packages/interactions/dist");

    await copy(source, resolve(dist, "index.js"));
    await write(
      resolve(dist, "index.cjs"),
      `"use strict";

function createDialog() {
  throw new Error(
    "@neo-brutal-ui/interactions: createDialog is not implemented in this preview build."
  );
}

module.exports = {
  createDialog,
};
`
    );
    await write(
      resolve(dist, "index.d.ts"),
      `export interface CreateDialogOptions {
  root: HTMLElement;
}

export declare function createDialog(options?: CreateDialogOptions): never;
`
    );
    break;
  }

  case "theme-neo-brutal": {
    const source = resolve(root, "packages/themes/neo-brutal/src/theme.css");
    const dist = resolve(root, "packages/themes/neo-brutal/dist");

    await copy(source, resolve(dist, "theme.css"));
    await copy(source, resolve(dist, "tokens.css"));
    break;
  }

  default:
    throw new Error(`Unknown package build target: ${target ?? "(missing)"}`);
}

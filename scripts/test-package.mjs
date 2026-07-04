import assert from "node:assert/strict";
import { execFileSync, execSync } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const tempRoot = resolve(root, ".tmp/package-smoke");
const packDir = resolve(tempRoot, "tarballs");
const consumerDir = resolve(tempRoot, "consumer");
const isWindows = process.platform === "win32";
const pnpm = isWindows ? "pnpm.cmd" : "pnpm";
const npm = isWindows ? "npm.cmd" : "npm";

const packages = [
  { target: "core", dir: "packages/core" },
  { target: "interactions", dir: "packages/interactions" },
  { target: "theme-neo-brutal", dir: "packages/themes/neo-brutal" }
];

function run(command, args, options = {}) {
  console.log(`\n$ ${[command, ...args].join(" ")}`);
  if (isWindows && command.endsWith(".cmd")) {
    execSync([command, ...args.map(quoteWindows)].join(" "), {
      cwd: root,
      stdio: "inherit",
      ...options
    });
    return;
  }

  execFileSync(command, args, {
    cwd: root,
    stdio: "inherit",
    ...options
  });
}

function quoteWindows(value) {
  return `"${String(value).replaceAll('"', '\\"')}"`;
}

async function readPackageJson(packageDir) {
  return JSON.parse(await readFile(resolve(root, packageDir, "package.json"), "utf8"));
}

function tarballName(packageJson) {
  const name = packageJson.name.replace(/^@/, "").replace(/\//g, "-");
  return `${name}-${packageJson.version}.tgz`;
}

function listTarballFiles(tarball) {
  return execFileSync("tar", ["-tf", tarball], {
    cwd: root,
    encoding: "utf8"
  })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function assertNoSourceFiles(tarball) {
  const files = listTarballFiles(tarball);
  const sourceFiles = files.filter((file) => file.includes("/src/") || file.endsWith(".map"));
  assert.deepEqual(sourceFiles, [], `${basename(tarball)} should not include src/ or source map files`);
}

async function writeConsumer(tarballs) {
  await mkdir(consumerDir, { recursive: true });
  await writeFile(
    resolve(consumerDir, "package.json"),
    `${JSON.stringify(
      {
        name: "neo-brutal-ui-package-smoke",
        private: true,
        type: "module",
        scripts: {
          smoke: "node smoke.mjs"
        }
      },
      null,
      2
    )}\n`
  );

  await writeFile(
    resolve(consumerDir, "smoke.mjs"),
    `import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const interactions = await import("@neo-brutal-ui/interactions");
const dropdown = await import("@neo-brutal-ui/interactions/dropdown");
const drawer = await import("@neo-brutal-ui/interactions/drawer");
const tooltip = await import("@neo-brutal-ui/interactions/tooltip");
const toast = await import("@neo-brutal-ui/interactions/toast");
const animations = await import("@neo-brutal-ui/interactions/animations");

assert.equal(typeof interactions.createDialog, "function");
assert.equal(typeof interactions.createTabs, "function");
assert.equal(typeof dropdown.createDropdown, "function");
assert.equal(typeof drawer.createDrawer, "function");
assert.equal(typeof tooltip.createTooltip, "function");
assert.equal(typeof toast.createToastManager, "function");
assert.equal(typeof animations.reveal, "function");

const coreCss = await readFile(
  new URL("./node_modules/@neo-brutal-ui/core/dist/index.css", import.meta.url),
  "utf8"
);
const themeCss = await readFile(
  new URL("./node_modules/@neo-brutal-ui/theme-neo-brutal/dist/theme.css", import.meta.url),
  "utf8"
);

assert.match(coreCss, /@layer nb\\.theme, nb\\.base, nb\\.components, nb\\.utilities/);
assert.match(coreCss, /\\[data-theme="neo-brutal-dark"\\]/);
assert.match(themeCss, /@neo-brutal-ui\\/theme-neo-brutal/);
assert.match(themeCss, /@import "@neo-brutal-ui\\/core\\/css"/);
assert.doesNotMatch(themeCss, /\\.\\.\\/\\.\\.\\/\\.\\.\\/core\\/src/);

const installedCore = JSON.parse(
  await readFile(new URL("./node_modules/@neo-brutal-ui/core/package.json", import.meta.url), "utf8")
);
const installedInteractions = JSON.parse(
  await readFile(new URL("./node_modules/@neo-brutal-ui/interactions/package.json", import.meta.url), "utf8")
);
const installedTheme = JSON.parse(
  await readFile(new URL("./node_modules/@neo-brutal-ui/theme-neo-brutal/package.json", import.meta.url), "utf8")
);
const coreReadme = await readFile(
  new URL("./node_modules/@neo-brutal-ui/core/README.md", import.meta.url),
  "utf8"
);
const interactionsReadme = await readFile(
  new URL("./node_modules/@neo-brutal-ui/interactions/README.md", import.meta.url),
  "utf8"
);
const themeReadme = await readFile(
  new URL("./node_modules/@neo-brutal-ui/theme-neo-brutal/README.md", import.meta.url),
  "utf8"
);

assert.equal(installedCore.private, false);
assert.equal(installedInteractions.private, false);
assert.equal(installedTheme.private, false);
assert.equal(installedInteractions.peerDependencies["@neo-brutal-ui/core"], "0.0.1");
assert.equal(installedTheme.peerDependencies["@neo-brutal-ui/core"], "0.0.1");
for (const packageJson of [installedCore, installedInteractions, installedTheme]) {
  assert.equal(packageJson.author, "Neo-Brutal UI Team");
  assert.equal(packageJson.publishConfig.access, "public");
  assert(packageJson.homepage.includes("github.com/williexiaogang/neobrutalUI"));
  assert(packageJson.bugs.url.includes("github.com/williexiaogang/neobrutalUI/issues"));
  assert(packageJson.repository.url.includes("github.com/williexiaogang/neobrutalUI.git"));
}
assert(coreReadme.includes("@neo-brutal-ui/core/css"));
assert(interactionsReadme.includes("@neo-brutal-ui/interactions/dialog"));
assert(themeReadme.includes("@neo-brutal-ui/theme-neo-brutal/css"));

console.log("package smoke passed");
`
  );

  console.log("\nPackage tarballs under test:");
  for (const tarball of tarballs) {
    console.log(`- ${basename(tarball)}`);
  }
}

async function main() {
  await rm(tempRoot, { recursive: true, force: true });
  await mkdir(packDir, { recursive: true });

  const tarballs = [];
  for (const pkg of packages) {
    run("node", ["scripts/build-package.mjs", pkg.target]);

    const packageJson = await readPackageJson(pkg.dir);
    run(pnpm, ["pack", "--pack-destination", packDir], {
      cwd: resolve(root, pkg.dir)
    });
    const tarball = resolve(packDir, tarballName(packageJson));
    assertNoSourceFiles(tarball);
    tarballs.push(tarball);
  }

  await writeConsumer(tarballs);

  run(npm, ["install", "--ignore-scripts", "--legacy-peer-deps", ...tarballs], {
    cwd: consumerDir
  });
  run(npm, ["run", "smoke"], { cwd: consumerDir });

  await rm(tempRoot, { recursive: true, force: true });
  console.log("\nPackage smoke completed successfully.");
}

main().catch(async (error) => {
  console.error("\nPackage smoke failed.");
  console.error(error);
  console.error(`Temporary files kept at ${tempRoot}`);
  process.exitCode = 1;
});

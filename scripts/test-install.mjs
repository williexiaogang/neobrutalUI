import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const tempRoot = resolve(root, ".tmp/install-test");
const packDir = resolve(tempRoot, "tarballs");
const consumerDir = resolve(tempRoot, "consumer");

const packages = [
  { name: "@neo-brutal-ui/core", dir: "packages/core" },
  { name: "@neo-brutal-ui/interactions", dir: "packages/interactions" },
  { name: "@neo-brutal-ui/theme-neo-brutal", dir: "packages/themes/neo-brutal" }
];

/**
 * Run a command via execSync, using process.chdir() to avoid cwd issues
 * on Windows Git Bash environments where cmd.exe is not available.
 */
function run(command, options = {}) {
  const { cwd = root, ...execOptions } = options;
  const prev = process.cwd();
  try {
    process.chdir(cwd);
    console.log(`\n$ ${command}`);
    execSync(command, { encoding: "utf8", stdio: "inherit", ...execOptions });
    process.chdir(prev);
  } catch (err) {
    process.chdir(prev);
    throw err;
  }
}

async function readPackageJson(packageDir) {
  return JSON.parse(await readFile(resolve(root, packageDir, "package.json"), "utf8"));
}

function tarballName(packageJson) {
  const name = packageJson.name.replace(/^@/, "").replace(/\//g, "-");
  return `${name}-${packageJson.version}.tgz`;
}

async function writeConsumer(tarballs) {
  await mkdir(consumerDir, { recursive: true });
  await writeFile(
    resolve(consumerDir, "package.json"),
    `${JSON.stringify(
      {
        name: "neo-brutal-ui-install-test",
        private: true,
        type: "module",
        scripts: {
          verify: "node verify.mjs"
        }
      },
      null,
      2
    )}\n`
  );

  const subpaths = [
    "dialog",
    "tabs",
    "dropdown",
    "drawer",
    "tooltip",
    "toast",
    "animations",
    "factory",
    "types",
    "accordion",
    "carousel",
    "collapse",
    "menu",
    "rating"
  ];

  const verifyScript = `import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";

// 1. Verify CSS imports (file existence and content)
const coreCss = await readFile(
  new URL("./node_modules/@neo-brutal-ui/core/dist/index.css", import.meta.url),
  "utf8"
);
assert(coreCss.length > 0, "core CSS is empty");
assert.match(coreCss, /@layer nb\\.theme/, "core CSS contains layer declaration");

const themeCss = await readFile(
  new URL("./node_modules/@neo-brutal-ui/theme-neo-brutal/dist/theme.css", import.meta.url),
  "utf8"
);
assert(themeCss.length > 0, "theme CSS is empty");

// 2. Verify JS imports from main entry
const interactions = await import("@neo-brutal-ui/interactions");
assert.equal(typeof interactions.createDialog, "function", "createDialog exported");
assert.equal(typeof interactions.createTabs, "function", "createTabs exported");
assert.equal(typeof interactions.createCarousel, "function", "createCarousel exported");
assert.equal(typeof interactions.createTooltip, "function", "createTooltip exported");
assert.equal(typeof interactions.createDropdown, "function", "createDropdown exported");
assert.equal(typeof interactions.createDrawer, "function", "createDrawer exported");
assert.equal(typeof interactions.createToastManager, "function", "createToastManager exported");
assert.equal(typeof interactions.createCollapse, "function", "createCollapse exported");
assert.equal(typeof interactions.createRating, "function", "createRating exported");
assert.equal(typeof interactions.reveal, "function", "reveal exported");

// 3. Verify subpath JS imports
${subpaths
    .map(
      (sp) => `
const ${sp}Mod = await import("@neo-brutal-ui/interactions/${sp}");
assert(typeof ${sp}Mod === "object" || typeof ${sp}Mod === "function", "${sp} subpath importable");`
    )
    .join("\n")}

// 4. Verify TypeScript types are present
const typeFiles = [
  "node_modules/@neo-brutal-ui/interactions/dist/index.d.ts",
  "node_modules/@neo-brutal-ui/interactions/dist/dialog.d.ts",
  "node_modules/@neo-brutal-ui/interactions/dist/tabs.d.ts",
  "node_modules/@neo-brutal-ui/interactions/dist/accordion.d.ts",
  "node_modules/@neo-brutal-ui/interactions/dist/carousel.d.ts",
  "node_modules/@neo-brutal-ui/interactions/dist/collapse.d.ts",
  "node_modules/@neo-brutal-ui/interactions/dist/menu.d.ts",
  "node_modules/@neo-brutal-ui/interactions/dist/rating.d.ts",
];

for (const file of typeFiles) {
  const path = new URL("./" + file, import.meta.url);
  await access(path);
  const content = await readFile(path, "utf8");
  assert(content.length > 0, \`\${file} is not empty\`);
}

// 5. Verify package metadata
const installedCore = JSON.parse(
  await readFile(new URL("./node_modules/@neo-brutal-ui/core/package.json", import.meta.url), "utf8")
);
const installedInteractions = JSON.parse(
  await readFile(new URL("./node_modules/@neo-brutal-ui/interactions/package.json", import.meta.url), "utf8")
);
const installedTheme = JSON.parse(
  await readFile(new URL("./node_modules/@neo-brutal-ui/theme-neo-brutal/package.json", import.meta.url), "utf8")
);

assert.equal(installedCore.sideEffects, true, "core sideEffects is true");
assert.equal(installedInteractions.sideEffects, false, "interactions sideEffects is false");
assert.equal(installedTheme.sideEffects, true, "theme sideEffects is true");
assert(installedCore.engines.node, "core engines.node exists");
assert(installedInteractions.engines.node, "interactions engines.node exists");
assert(installedTheme.engines.node, "theme engines.node exists");
assert(installedInteractions.exports["./accordion"], "accordion subpath export exists");
assert(installedInteractions.exports["./carousel"], "carousel subpath export exists");
assert(installedInteractions.exports["./collapse"], "collapse subpath export exists");
assert(installedInteractions.exports["./menu"], "menu subpath export exists");
assert(installedInteractions.exports["./rating"], "rating subpath export exists");

console.log("install verification passed");
`;

  await writeFile(resolve(consumerDir, "verify.mjs"), verifyScript);

  console.log("\nTarballs under test:");
  for (const tarball of tarballs) {
    console.log(`- ${tarball}`);
  }
}

async function main() {
  await rm(tempRoot, { recursive: true, force: true });
  await mkdir(packDir, { recursive: true });

  const tarballs = [];
  for (const pkg of packages) {
    const packageJson = await readPackageJson(pkg.dir);

    // Use npm pack via relative paths from the project root
    run(`npm pack ./${pkg.dir} --pack-destination ./${relative(root, packDir)}`);
    const tarball = resolve(packDir, tarballName(packageJson));
    tarballs.push(tarball);
  }

  await writeConsumer(tarballs);

  // Install tarballs in the consumer directory using relative paths
  const relativeTarballs = tarballs.map((t) => `./${relative(consumerDir, t)}`);
  run(`npm install --ignore-scripts --legacy-peer-deps ${relativeTarballs.join(" ")}`, {
    cwd: consumerDir
  });
  run("npm run verify", { cwd: consumerDir });

  await rm(tempRoot, { recursive: true, force: true });
  console.log("\n✅ Install verification completed successfully.");
}

function relative(from, to) {
  const fromParts = from.split(/[\\/]/g);
  const toParts = to.split(/[\\/]/g);
  let i = 0;
  while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) {
    i++;
  }
  const up = fromParts.length - i;
  const down = toParts.slice(i);
  return [...Array(up).fill(".."), ...down].join("/");
}

main().catch((error) => {
  console.error("\n❌ Install verification failed.");
  console.error(error);
  console.error(`Temporary files kept at ${tempRoot}`);
  process.exitCode = 1;
});

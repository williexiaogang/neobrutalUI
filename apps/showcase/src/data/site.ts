export const site = {
  name: "Neo-Brutal UI",
  title: "Neo-Brutal UI Showcase",
  tagline: "A bold, accessible component library for Tailwind CSS v4.",
  description:
    "Neo-Brutal UI is a bold, accessible component library built for Tailwind CSS v4. Explore available components, current development status, and upcoming releases.",
  url: "https://neo-brutal-ui.github.io",
  locale: "en-US",
  lang: "en",
  version: "v0.0.2-alpha",
  versionLabel: "Alpha",
  packages: {
    core: "@neo-brutal-ui/core",
    theme: "@neo-brutal-ui/theme-neo-brutal",
    interactions: "@neo-brutal-ui/interactions",
  },
  installCommand:
    "npm install @neo-brutal-ui/core @neo-brutal-ui/theme-neo-brutal @neo-brutal-ui/interactions tailwindcss",
  cssImport: '@import "@neo-brutal-ui/theme-neo-brutal/css";',
  jsImport: 'import { createDialog } from "@neo-brutal-ui/interactions/dialog";',
  githubUrl: "https://github.com/williexiaogang/neobrutalUI",
  npmUrl: "https://www.npmjs.com/package/@neo-brutal-ui/core",
  license: "MIT",
  licenseUrl: "",
  author: "Neo-Brutal UI Team",
} as const;

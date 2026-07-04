# Release Checklist

Neo-Brutal UI publishes three npm packages:

- `@neo-brutal-ui/core`
- `@neo-brutal-ui/interactions`
- `@neo-brutal-ui/theme-neo-brutal`

The packages are configured as a fixed Changesets group so they release with the same version while the package family is early and peer dependencies are tight.

## Before Publishing

```sh
pnpm install
pnpm run lint
pnpm run test
pnpm run test:package
pnpm --filter @neo-brutal-ui/showcase build
```

## Create A Changeset

```sh
pnpm run changeset
```

Choose the package changes and bump level. Because the publishable packages are fixed together, Changesets will keep their versions aligned.

## Version Packages

```sh
pnpm run version-packages
```

Review the generated changelog and package version changes before committing.

## Publish

```sh
pnpm run release
```

The release script runs `test:package` before publishing. npm authentication and access to the `@neo-brutal-ui` scope must already be configured in the local environment or CI.

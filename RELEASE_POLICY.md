# Release Policy

## Scope and immutability

The published artifact is scoped as `@xbibzlibrary/telebibz`. npm package versions are immutable after publication: a released version must not be overwritten. Future changes require a new version and a new release candidate. Consumers can still fork or modify a locally installed copy; no npm package can technically prevent that. This project therefore protects the official release path rather than making local copies impossible to alter.

## Hardening controls

Every release must pass strict TypeScript typechecking, type-level tests, lint, runtime tests, build for ESM and CommonJS, dependency audit, and `release:check`. The release checker rejects an incorrect scope, private package status, missing public publish configuration, missing provenance, install lifecycle scripts, credential patterns in tracked release content, and incomplete tarball contents.

The package uses npm provenance configuration and a protected GitHub Actions release workflow. The publish token must be stored only as a repository secret or temporary `NPM_TOKEN` environment variable with the smallest possible scope. Tokens must never be committed, placed in `.npmrc` inside the repository, or included in archives.

## Release verification

Before publish, run:

```bash
npm run typecheck
npm run test:types
npm run lint
npm test
npm run build
npm run security
npm run release:check
npm pack --dry-run
```

After publish, verify the public registry metadata and tarball with `npm view @xbibzlibrary/telebibz version dist.integrity dist.tarball` and a clean install into a new directory. Record the tarball integrity value with the release notes.

## Organization permissions

Only maintainers with publish permission in the `xbibzlibrary` organization may publish. Enable two-factor authentication or organization-level publish controls where available. Use granular access tokens and rotate them immediately if they are pasted into chat, logs, source, or any untrusted system.

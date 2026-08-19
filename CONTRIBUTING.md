# Contributing to telebibz

Thank you for helping improve telebibz. Contributions are welcome when they are focused, reproducible, tested, documented, and compatible with the project's security and release policies.

## Before you start

Read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), [CONTRIBUTION_RULES.md](CONTRIBUTION_RULES.md), [SECURITY.md](SECURITY.md), and [RELEASE_POLICY.md](RELEASE_POLICY.md). Do not open a public issue for a security vulnerability or include tokens, private chat identifiers, production payloads, or other sensitive data in an issue, pull request, test, log, screenshot, or commit.

Check existing issues and pull requests before opening a new one. For a defect, use the bug template and include a minimal reproduction. For a new capability, use the feature template and explain the public API, behavior, compatibility, and testing implications.

## Local setup

The project requires Node.js `>=20` and uses npm for release-compatible commands. Install dependencies and run the baseline checks:

```bash
npm ci
npm run typecheck
npm run test:types
npm run lint
npm test
npm run build
npm run security
npm run release:check
```

The credential-gated Telegram E2E suite is skipped unless the required test environment variables are provided. Never use production credentials in tests. Use `MockTransport`, `createTestBot()`, `createMockUpdate()`, and the integration fixtures for deterministic tests.

## Branches and commits

Create a focused branch from `main`. Keep unrelated refactors out of a feature or bug-fix pull request. Use an imperative Conventional Commit-style message, for example `fix: isolate polling handler failures` or `docs: expand storage adapter reference`. Include `[skip release]` only when a change must not trigger the GitHub-to-npm release workflow; maintainers may remove that marker when a release is appropriate.

## Implementation expectations

Public behavior must be implemented in TypeScript with strict typing. Do not add fake responses, silent stubs, undocumented breaking behavior, or untested branches. Preserve ESM and CommonJS builds, zero runtime vendor dependencies in the core package, Node.js `>=20` compatibility, and the existing package export map.

Changes to routing, context, lifecycle, transport, storage, queue, scheduler, approval, generated API declarations, or release automation require regression tests. Changes to a public function, class, method, option, error, event, or generated method require a corresponding API documentation update. Changes that affect package contents must pass `release:check` and `npm pack --dry-run`.

## Pull request process

Open a pull request against `main` and complete the pull request template. Explain the problem, solution, compatibility impact, test evidence, documentation changes, and security implications. Keep the diff reviewable. Maintainers may request changes, split a pull request, or ask for a follow-up issue when scope is too broad.

Every pull request must pass the CI workflow. A maintainer reviews API compatibility, error handling, tests, documentation, package contents, and release impact before approval. Do not merge while required checks are failing or unresolved security concerns remain.

## Documentation and translations

English is the default README language. Keep `README.id.md`, `README.zh-CN.md`, `docs/API.id.md`, and `docs/API.zh-CN.md` synchronized when public behavior changes. Code signatures, method names, package names, environment variables, and command names must remain exact in every translation.

## Release process

Normal pushes to `main` can trigger the protected auto-publish workflow. The workflow runs quality gates, computes an unused patch version, publishes the package, commits the version, creates a tag, and creates a GitHub Release. See [RELEASE_AUTOMATION.md](RELEASE_AUTOMATION.md) for the required `NPM_TOKEN` secret and private-source provenance constraint. Contributors must not publish directly to npm unless explicitly authorized by the maintainers.

## Questions

Use the question/support template for usage questions and consult the [English API reference](docs/API.md) first. Keep support requests free of credentials and private user data.

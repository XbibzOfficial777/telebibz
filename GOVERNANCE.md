# Governance

## Project purpose

telebibz is a TypeScript Telegram Bot Framework. Governance exists to preserve a stable public API, honest feature scope, secure release automation, and a respectful contributor community.

## Roles

| Role | Responsibility |
|---|---|
| Users | Report reproducible defects, explain use cases, and provide feedback without publishing secrets. |
| Contributors | Submit focused code, tests, documentation, and issue reports that follow the project rules. |
| Reviewers | Examine correctness, compatibility, security, tests, documentation, and operational risk. |
| Maintainers | Set project direction, review and merge changes, manage releases, triage issues, and protect the repository. |
| Release maintainers | Control npm credentials, GitHub Actions environments, version tags, npm publication, and release verification. |

One person may hold multiple roles, but security-sensitive actions should use separation of duties whenever practical.

## Decision-making

Routine decisions are made by maintainers through pull request review and documented issue discussion. Decisions should be based on user benefit, implementation quality, compatibility, security, maintenance cost, and evidence from tests or production reports.

For controversial or breaking changes, maintainers should document alternatives, migration impact, and the reason for the selected approach. A maintainer may request a design note before implementation. Silence is not approval for a breaking change.

## Triage

New issues are initially classified as bug, feature, documentation, security, support, or duplicate. Maintainers may request a reproduction, reduce sensitive details, split scope, mark a report as blocked, or close it when the requested behavior conflicts with the documented project contract.

Security reports are handled privately according to [SECURITY.md](SECURITY.md). Public issues must not contain exploit instructions, credentials, or personal data.

## Pull requests

A pull request requires a passing CI workflow and at least one maintainer review. Changes affecting authentication, transport, update dispatch, persistence, release automation, package exports, or security policy may require additional review. Maintainers can require a regression test, API documentation, migration note, or threat-model explanation before merge.

## Releases

The protected GitHub Actions workflow is the canonical release path. It runs quality gates, computes a new immutable npm version, publishes the package, creates a version commit and tag, and creates a GitHub Release. Direct npm publication is restricted to authorized release maintainers. Release credentials must remain in GitHub or npm secret storage and must be rotated after exposure.

Because the source repository is private, the workflow uses npm publish without provenance. If the repository becomes public and provenance is enabled, the policy and workflow must be reviewed together before the next release.

## Repository protection

Required CI checks, branch protection, environment approvals, workflow permissions, package scope, and immutable release rules must not be weakened casually. Any change to these controls requires a pull request, a written rationale, and maintainer approval.

## Amendments

Governance changes are proposed through a pull request that explains the current problem, proposed rule, affected roles, and migration plan. The updated governance document becomes effective when the pull request merges.

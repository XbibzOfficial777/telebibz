# Contribution Rules

These rules are the operational requirements for contributions to telebibz. They complement [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Scope and ownership

A contribution must have a clear owner, a stated problem, and a bounded outcome. Large changes should be split into reviewable pull requests. Maintainers may reject work that is technically correct but outside the package scope, duplicates an existing design, introduces unnecessary dependencies, or creates disproportionate maintenance cost.

## API and compatibility rules

Public exports, constructor options, method signatures, event names, error classes, generated method names, package entrypoints, and persisted data formats are compatibility-sensitive. A breaking change requires an explicit migration note, a versioning decision, updated type-level tests, and maintainer approval.

New public APIs must have strict TypeScript types, runtime validation where input can be unsafe, deterministic error behavior, examples, and API reference documentation. Avoid `any` in public signatures. When a Telegram type is not specialized in the core method map, use the vendored `TelegramTypes` declarations or an honest generic boundary rather than inventing an inaccurate shape.

## Runtime and error-handling rules

Network operations must honor timeout and cancellation behavior. Retry logic must be bounded and must not retry authentication or validation failures blindly. Update handlers must not terminate polling because one update failed. Background tasks must surface errors through documented hooks or events and must not create unhandled promise rejections.

Callback-query handling must work for both message-backed and inline callbacks. Router behavior must state whether first-match or all-match is used. Nested middleware must not execute terminal handlers twice. Persistent state must use the `Storage` abstraction and must document consistency, TTL, and driver assumptions.

## Testing rules

A pull request must add or update tests for every changed behavior. Use unit tests for pure logic, integration tests for module boundaries, type-level tests for public signatures, and credential-gated E2E tests only for real Telegram behavior that cannot be represented safely by mocks. Tests must be deterministic and must clean up timers, temporary files, listeners, and network resources.

A bug fix is incomplete without a regression test that fails against the old behavior. A feature is incomplete without tests for success, invalid input, cancellation, retry/failure, and boundary behavior where applicable.

## Documentation rules

Documentation must describe the implementation that exists in source, not a planned feature. Every documented limitation must remain accurate. English is canonical; Indonesian and Simplified Chinese translations must preserve signatures, code blocks, URLs, environment variables, and command names exactly.

## Dependency and security rules

Do not add a runtime dependency without a written justification, license review, bundle/package impact analysis, and maintainer approval. Never commit credentials, private keys, Telegram tokens, npm tokens, test secrets, or real user data. Security-sensitive changes require review of [SECURITY.md](SECURITY.md) and must not be disclosed publicly before a fix or coordinated disclosure decision.

## Release and repository rules

Do not edit or overwrite an already published npm version. Do not manually create a release tag that conflicts with the protected workflow. Do not bypass required checks, disable security audit, weaken release checks, or modify workflow permissions without maintainer approval. Use `[skip release]` only for changes that must not publish a package.

## Review standards

Reviewers should verify correctness, compatibility, tests, documentation, security, package contents, and operational behavior. Approval is not a guarantee that no defect exists; it confirms that the change meets the current project acceptance criteria and is safe to merge based on the available evidence.

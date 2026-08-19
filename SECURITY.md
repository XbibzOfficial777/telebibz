# Security Policy

## Supported versions

Security fixes target the latest development branch and the latest published stable release. Older versions may not receive backports. Upgrade to the latest release before requesting a fix unless the issue prevents upgrading.

| Version | Supported |
|---|---|
| `main` | Yes, subject to current development changes |
| Latest `0.x` release | Yes |
| Older releases | Best effort only |

## Reporting a vulnerability

Do not publish tokens, sensitive payloads, exploit instructions, private chat content, or personal data in a public issue, pull request, discussion, or commit.

Use GitHub's private vulnerability reporting or Security Advisory flow for this repository when available: [Report a private vulnerability](https://github.com/XbibzOfficial777/telebibz/security/advisories/new). If that flow is unavailable, contact the repository maintainers privately through an authenticated GitHub channel and request a secure reporting path. Do not create a public issue to ask where to report a vulnerability.

A useful report includes the affected version or commit, Node.js version, impact, attack prerequisites, a minimal safe reproduction, affected subsystem, and a proposed mitigation if known. Redact credentials, personal information, private Telegram identifiers, and production payloads. Attachments should be sanitized before submission.

## What to report privately

Report authentication bypasses, secret exposure, webhook verification failures, unsafe file or URL handling, arbitrary code execution, injection, cross-user state leakage, approval-gate bypasses, dependency supply-chain issues, release-workflow compromise, and vulnerabilities that can cause unauthorized Telegram actions or data disclosure.

Ordinary bugs without a security impact should use the public [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.yml). Documentation and support requests should use their dedicated templates.

## Response process

Maintainers acknowledge a private report when practical, reproduce it in an isolated environment, assess severity and affected versions, coordinate a fix, and publish a security advisory or release note when disclosure is appropriate. Timelines depend on severity, reproducibility, maintainer availability, and coordination with affected users or upstream providers.

Reporters should allow reasonable time for remediation and coordinated disclosure. Do not publicly disclose a vulnerability, proof of exploit, or affected production target before maintainers confirm that disclosure is safe.

## Security boundaries

telebibz does not send telemetry to third parties automatically. Tokens must be supplied through environment variables or a secret manager and must never be committed to source control, issue text, logs, screenshots, package archives, or workflow output.

Telegram input is untrusted. Callback data, file paths, URLs, JSON payloads, and user-provided text must be validated before being used as filesystem, network, database, shell, or authorization input. Webhook deployments must restrict access, verify the Telegram secret token, enforce body-size limits, and apply infrastructure-level rate limiting where appropriate.

Storage adapters are security boundaries owned by the application. Configure Redis, SQL, Mongo, and file permissions according to the deployment threat model. Do not store secrets or unnecessary personal data in sessions, conversations, caches, queues, or approval records.

## Credential exposure and rotation

If a Telegram or npm credential is exposed, revoke or rotate it immediately through the relevant provider, remove it from uncommitted files and logs, invalidate affected sessions, inspect release history, and report the exposure privately. Removing a secret from the latest commit does not remove it from history or external logs.

## Security updates

Security fixes may change behavior or require a new immutable npm version. Follow [RELEASE_POLICY.md](RELEASE_POLICY.md) and [RELEASE_AUTOMATION.md](RELEASE_AUTOMATION.md) for the protected release path.

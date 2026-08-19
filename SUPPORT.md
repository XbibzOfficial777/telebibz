# Support Policy

## Before requesting support

Read the [English API reference](docs/API.md), the localized API references, [CONTRIBUTING.md](CONTRIBUTING.md), and the relevant release or security policy. Search existing issues and discussions before opening a new request.

## Where to ask

| Need | Channel |
|---|---|
| Usage question or configuration help | GitHub issue using the Question/Support template |
| Reproducible defect | GitHub issue using the Bug Report template |
| New capability | GitHub issue using the Feature Request template |
| Documentation error | GitHub issue using the Documentation template |
| Security vulnerability | Private process described in [SECURITY.md](SECURITY.md); never a public issue |
| Contribution or patch | Pull request following [CONTRIBUTING.md](CONTRIBUTING.md) |

## Information to include

Provide the telebibz version, Node.js version, operating system where relevant, module system, minimal reproduction, expected behavior, actual behavior, stack trace with secrets removed, and the result of relevant quality gates. Include whether the behavior occurs with ESM, CommonJS, mocks, or a real Telegram environment.

Never include Telegram bot tokens, npm tokens, private keys, cookies, authorization headers, real user identifiers, private chat content, or unredacted production payloads. Replace sensitive values with placeholders before posting.

## Response expectations

This is a community-maintained project. Maintainers prioritize security reports, release blockers, data-loss risks, regressions, and reproducible runtime failures. Response and fix times are not guaranteed. A support request may be closed when it lacks a reproduction after reasonable follow-up, duplicates an existing issue, or asks for behavior outside the documented scope.

## Support boundaries

Support does not include operating a user's production infrastructure, recovering deleted credentials, guaranteeing Telegram availability, or bypassing npm/GitHub permission controls. For Telegram platform behavior, verify the official Telegram Bot API documentation as well as the telebibz API reference.

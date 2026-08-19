# npm Release Report

## Published artifact

| Field | Value |
|---|---|
| Package | `@xbibzlibrary/telebibz` |
| Version | `0.1.0` |
| Organization | `xbibzlibrary` |
| Dist-tag | `latest` |
| Registry | [npm package page](https://www.npmjs.com/package/@xbibzlibrary/telebibz) |
| Tarball | `https://registry.npmjs.org/@xbibzlibrary/telebibz/-/telebibz-0.1.0.tgz` |
| npm dist integrity | `sha512-87OAw1D4jppDvad7ow1G5clJDP/5SozpHBxt0horL5Pnu4c+7clsLRyTSu/GsdqUOUGbb0+161eYCHgtJPLEcQ==` |
| Public access status | Verified via npm access API |

## Verification

The first scoped release was published successfully with public access. npm package versions are immutable; a retry of the same version was rejected by npm with the expected `cannot publish over the previously published versions: 0.1.0` response. This confirms that the package cannot be silently overwritten at the same version.

After registry propagation, the public packument returned HTTP 200 with `latest: 0.1.0`. A clean install of the published tarball passed both ESM and CommonJS import checks for `Bot`, `InlineKeyboard`, and `ApprovalGate`. The release candidate passed strict typecheck, type-level tests, lint, runtime tests, ESM/CommonJS build, security audit with zero vulnerabilities, release checker, and package check before publish.

## Hardening status

The package is scoped to the organization, public, and configured with immutable-version release semantics. The repository includes `release:check`, a protected GitHub release workflow with npm provenance configuration, secret scanning for release content, no install lifecycle scripts, clean tarball checks, and release policy documentation.

As a technical limitation, npm cannot stop a consumer from modifying a local copy after installation or forking the project. The official registry artifact and published version are protected by npm’s immutable-version rule; future changes must use a new semantic version and pass the protected release gates.

## Credential handling

The npm token was read only from a temporary user-provided file and was not written to source, package files, archives, logs, or `.npmrc`. Because credentials were shared through the conversation/upload channel, rotate the token after the release and use a granular token or CI secret for future releases.

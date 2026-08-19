# GitHub Packages

`@xbibzlibrary/telebibz` is released to both [npmjs](https://www.npmjs.com/package/@xbibzlibrary/telebibz) and the GitHub Packages npm registry. The canonical GitHub repository is [XbibzOfficial777/telebibz](https://github.com/XbibzOfficial777/telebibz).

## Registry

GitHub Packages uses the following npm registry URL:

```text
https://npm.pkg.github.com
```

The package scope is mapped to GitHub Packages with:

```ini
@xbibzlibrary:registry=https://npm.pkg.github.com
```

The release workflow publishes the same verified tarball to npmjs and GitHub Packages after the type checks, tests, build, security audit, and release checks pass. The workflow uses `GITHUB_TOKEN` with `packages: write`; no GitHub personal access token is stored in the repository or workflow file.

## Installing the package

For a public package, use a GitHub Packages-aware `.npmrc` in the consuming project:

```ini
@xbibzlibrary:registry=https://npm.pkg.github.com
```

If the package or repository is private, authenticate with a **personal access token (classic)** that has at least `read:packages` access. Store the token outside the repository, preferably in the user-level npm configuration or an environment-variable reference:

```ini
@xbibzlibrary:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

Then install the package:

```bash
export GITHUB_PACKAGES_TOKEN="<your-read-packages-token>"
npm install @xbibzlibrary/telebibz
```

Do not replace the placeholder with a real token in a committed file. Do not commit `.npmrc` files containing literal credentials, and do not paste tokens into issues, pull requests, logs, or chat.

## Publishing locally

The recommended publishing path is the protected GitHub Actions workflow. It verifies the version and publishes only after all release gates succeed. Local publishing is intended for maintainers who have a classic personal access token with `write:packages` and repository permission to publish packages:

```bash
export GITHUB_PACKAGES_TOKEN="<your-write-packages-token>"
printf '@xbibzlibrary:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}\n' > "$HOME/.npmrc"
npm run build
npm pack
npm publish ./xbibzlibrary-telebibz-<version>.tgz --registry=https://npm.pkg.github.com --access public
```

Use a new semantic version for every publication. Registry versions are immutable; an existing version must never be overwritten.

## GitHub Actions permissions

The release workflow declares the minimum package permission required for publication:

```yaml
permissions:
  contents: write
  packages: write
```

`NPM_TOKEN` remains an environment secret for npmjs publication. GitHub Packages uses the automatically provided `GITHUB_TOKEN`, so no additional GitHub token secret is required for the repository's own package. If organization policy disables automatic package access inheritance, connect the package to the repository and grant the workflow access under the package's settings.

## Troubleshooting

A `401 Unauthorized` response normally means the token is missing, expired, or lacks the required package scope. A `403 Forbidden` response usually means the account or workflow does not have permission to the package, or that organization policy blocks publication. A `404 Not Found` response can occur when a private package is queried without authentication or when the scope is not mapped to `https://npm.pkg.github.com`.

For npmjs installation, omit the GitHub scope mapping or use the default npm registry. Both registries contain the same package name and release version, but authentication and access control are handled independently.

## References

1. [Working with the npm registry — GitHub Docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
2. [About permissions for GitHub Packages — GitHub Docs](https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages)
3. [Publishing and installing a package with GitHub Actions — GitHub Docs](https://docs.github.com/en/packages/quickstart)
4. [npm package.json publishConfig — npm Docs](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#publishconfig)

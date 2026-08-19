# GitHub Packages

`@xbibzlibrary/telebibz` 同时发布到 [npmjs](https://www.npmjs.com/package/@xbibzlibrary/telebibz) 和 GitHub Packages npm registry。官方 GitHub 仓库是 [XbibzOfficial777/telebibz](https://github.com/XbibzOfficial777/telebibz)。

## Registry

GitHub Packages 使用以下 npm registry 地址：

```text
https://npm.pkg.github.com
```

npm scope 映射如下：

```ini
@xbibzlibrary:registry=https://npm.pkg.github.com
```

release workflow 会在 typecheck、测试、构建、安全审计和 release check 全部通过后，将同一个经过验证的 tarball 发布到 npmjs 和 GitHub Packages。workflow 使用具有 `packages: write` 权限的 `GITHUB_TOKEN`，不会把 GitHub personal access token 存储在仓库或 workflow 文件中。

## 安装 package

对于 public package，可以在使用方项目的 `.npmrc` 中加入：

```ini
@xbibzlibrary:registry=https://npm.pkg.github.com
```

如果 package 或 repository 是 private，请使用具有至少 `read:packages` 权限的 **personal access token (classic)**。请将 token 保存在仓库之外，建议使用 npm 用户配置中的环境变量引用：

```ini
@xbibzlibrary:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

然后执行：

```bash
export GITHUB_PACKAGES_TOKEN="<your-read-packages-token>"
npm install @xbibzlibrary/telebibz
```

不要把真实 token 写入已经提交的文件。不要提交包含明文凭据的 `.npmrc`，也不要在 issue、pull request、日志或聊天中粘贴 token。

## 本地发布

推荐使用受保护的 GitHub Actions workflow 发布。workflow 会检查版本，并且只有所有 release gate 成功后才会发布。本地发布仅适用于拥有 `write:packages` classic token 以及 repository 发布权限的 maintainer：

```bash
export GITHUB_PACKAGES_TOKEN="<your-write-packages-token>"
printf '@xbibzlibrary:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}\n' > "$HOME/.npmrc"
npm run build
npm pack
npm publish ./xbibzlibrary-telebibz-<version>.tgz --registry=https://npm.pkg.github.com --access public
```

每次发布必须使用新的 semantic version。registry 中的版本是 immutable，不能覆盖已有版本。

## GitHub Actions 权限

release workflow 声明了发布所需的最小权限：

```yaml
permissions:
  contents: write
  packages: write
```

`NPM_TOKEN` 仍然作为 npmjs 发布所需的 environment secret。GitHub Packages 使用自动提供的 `GITHUB_TOKEN`，因此本仓库的 package 不需要额外的 GitHub token secret。如果组织策略关闭了 package 权限自动继承，请在 package 设置中连接 repository，并授予 workflow 访问权限。

## 故障排查

`401 Unauthorized` 通常表示 token 缺失、过期或没有正确的 package scope。`403 Forbidden` 通常表示账号或 workflow 没有 package 权限，或者组织策略禁止发布。访问 private package 时没有认证，或 scope 没有映射到 `https://npm.pkg.github.com`，也可能得到 `404 Not Found`。

从 npmjs 安装时，请删除 GitHub scope mapping 或使用默认 npm registry。两个 registry 包含相同的 package 名称和版本，但认证和 access control 独立管理。

## 参考资料

1. [Working with the npm registry — GitHub Docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
2. [About permissions for GitHub Packages — GitHub Docs](https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages)
3. [Publishing and installing a package with GitHub Actions — GitHub Docs](https://docs.github.com/en/packages/quickstart)
4. [npm package.json publishConfig — npm Docs](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#publishconfig)

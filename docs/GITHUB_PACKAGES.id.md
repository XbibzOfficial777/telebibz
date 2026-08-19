# GitHub Packages

`@xbibzlibrary/telebibz` dirilis ke [npmjs](https://www.npmjs.com/package/@xbibzlibrary/telebibz) dan registry npm GitHub Packages. Repository GitHub resminya adalah [XbibzOfficial777/telebibz](https://github.com/XbibzOfficial777/telebibz).

## Registry

URL registry GitHub Packages:

```text
https://npm.pkg.github.com
```

Mapping scope npm:

```ini
@xbibzlibrary:registry=https://npm.pkg.github.com
```

Workflow release mempublikasikan tarball yang sama ke npmjs dan GitHub Packages setelah typecheck, test, build, security audit, dan release check berhasil. Workflow menggunakan `GITHUB_TOKEN` dengan permission `packages: write`; personal access token GitHub tidak disimpan di repository atau workflow.

## Instalasi package

Untuk package public, tambahkan mapping berikut pada `.npmrc` project yang memakai package:

```ini
@xbibzlibrary:registry=https://npm.pkg.github.com
```

Jika package atau repository bersifat private, gunakan **personal access token (classic)** dengan minimal akses `read:packages`. Simpan token di luar repository, sebaiknya melalui environment variable reference pada konfigurasi npm user:

```ini
@xbibzlibrary:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

Kemudian jalankan:

```bash
export GITHUB_PACKAGES_TOKEN="<token-read-packages-kamu>"
npm install @xbibzlibrary/telebibz
```

Jangan mengganti placeholder dengan token asli di file yang di-commit. Jangan commit `.npmrc` yang berisi kredensial literal, dan jangan memasukkan token ke issue, pull request, log, atau chat.

## Publikasi lokal

Cara yang direkomendasikan adalah workflow GitHub Actions yang telah dilindungi. Workflow memeriksa versi dan hanya publish setelah seluruh release gate berhasil. Publikasi lokal hanya untuk maintainer yang memiliki personal access token (classic) dengan `write:packages` serta permission repository:

```bash
export GITHUB_PACKAGES_TOKEN="<token-write-packages-kamu>"
printf '@xbibzlibrary:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}\n' > "$HOME/.npmrc"
npm run build
npm pack
npm publish ./xbibzlibrary-telebibz-<version>.tgz --registry=https://npm.pkg.github.com --access public
```

Gunakan semantic version baru untuk setiap publikasi. Versi registry bersifat immutable dan tidak boleh ditimpa.

## Permission GitHub Actions

Workflow release menggunakan permission minimum berikut:

```yaml
permissions:
  contents: write
  packages: write
```

`NPM_TOKEN` tetap menjadi environment secret untuk publikasi ke npmjs. GitHub Packages menggunakan `GITHUB_TOKEN` otomatis, sehingga tidak memerlukan secret GitHub tambahan untuk package milik repository ini. Jika kebijakan organisasi menonaktifkan pewarisan akses package, hubungkan package ke repository dan berikan akses workflow melalui pengaturan package.

## Troubleshooting

Respons `401 Unauthorized` biasanya berarti token tidak ada, sudah kedaluwarsa, atau tidak mempunyai scope package yang benar. Respons `403 Forbidden` biasanya berarti akun atau workflow tidak memiliki permission package, atau kebijakan organisasi memblokir publikasi. Respons `404 Not Found` dapat muncul ketika package private diakses tanpa autentikasi atau scope belum diarahkan ke `https://npm.pkg.github.com`.

Untuk instalasi dari npmjs, hapus mapping GitHub scope atau gunakan registry npm default. Kedua registry berisi nama package dan versi yang sama, tetapi autentikasi dan access control dikelola secara terpisah.

## Referensi

1. [Working with the npm registry — GitHub Docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
2. [About permissions for GitHub Packages — GitHub Docs](https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages)
3. [Publishing and installing a package with GitHub Actions — GitHub Docs](https://docs.github.com/en/packages/quickstart)
4. [npm package.json publishConfig — npm Docs](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#publishconfig)

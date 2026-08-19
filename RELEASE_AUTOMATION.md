# GitHub-to-npm and GitHub Packages Release Automation

Repository ini menggunakan GitHub Actions untuk menjaga source GitHub, package npmjs, dan package GitHub Packages tetap sinkron melalui satu jalur release yang tervalidasi. Repository source tetap private; karena itu workflow menggunakan npm publish tanpa provenance, sesuai batasan registry npm untuk source private. Panduan instalasi GitHub Packages tersedia dalam [English](docs/GITHUB_PACKAGES.md), [Bahasa Indonesia](docs/GITHUB_PACKAGES.id.md), dan [简体中文](docs/GITHUB_PACKAGES.zh-CN.md).

## Alur otomatis

Setiap push ke branch `main` menjalankan workflow `.github/workflows/auto-publish.yml`, kecuali commit tersebut memuat marker `[skip release]`.

| Tahap | Perilaku |
|---|---|
| Checkout | Mengambil seluruh history agar tag dapat dibuat dengan benar. |
| Install | Menjalankan `npm ci --ignore-scripts`. |
| Version | Membaca versi dari `package.json`, membaca versi latest npm, lalu memilih patch version berikutnya yang lebih tinggi dari keduanya. |
| Verification | Menjalankan typecheck, type-level tests, lint, runtime tests, build ESM/CommonJS, security audit, dan release check. |
| Immutable guard | Menolak publish jika versi target sudah ada di npmjs atau GitHub Packages. |
| Git sync | Commit otomatis `chore(release): vX.Y.Z [skip release]`, membuat annotated tag `vX.Y.Z`, lalu push commit dan tag ke GitHub. |
| npmjs publish | Menerbitkan tarball terverifikasi ke npmjs menggunakan `NPM_TOKEN`; provenance dinonaktifkan karena npm menolak provenance dari source repository private. |
| GitHub Packages publish | Menerbitkan tarball yang sama ke `https://npm.pkg.github.com` menggunakan `GITHUB_TOKEN` dan permission `packages: write`. |
| GitHub Release | Membuat GitHub Release dengan generated notes. |

Push commit version otomatis tidak memicu release kedua karena mengandung `[skip release]`. Workflow menggunakan concurrency sehingga release berjalan satu per satu.

## Secret dan permission yang wajib tersedia

Workflow membutuhkan `packages: write` untuk GitHub Packages dan `contents: write` untuk version bump, tag, serta GitHub Release. Buka repository GitHub, kemudian masuk ke **Settings → Secrets and variables → Actions** dan tambahkan repository atau environment secret berikut:

```text
NPM_TOKEN=${NPM_TOKEN}
```

GitHub Packages menggunakan `GITHUB_TOKEN` bawaan Actions; tidak perlu membuat atau menyimpan GitHub PAT sebagai repository secret untuk package yang diterbitkan oleh workflow repository ini.

Jika memakai GitHub Environment bernama `npm-release`, secret dapat disimpan sebagai environment secret dan environment tersebut dapat diberi required reviewers untuk approval manual sebelum publish.

Jangan menyimpan token di repository, `.npmrc`, source code, issue, commit, atau workflow. Token npm yang pernah ditempelkan di chat harus dicabut dan diganti dengan granular token baru.

## Aturan penggunaan

Perubahan source biasa dapat dipush ke `main`; workflow akan menghasilkan patch release baru setelah seluruh quality gates lulus. Karena versi npm immutable, workflow tidak pernah menimpa versi yang telah ada.

Untuk perubahan besar, ubah `package.json` ke major/minor version yang diinginkan sebelum push. Workflow tetap memastikan hasil akhir lebih tinggi daripada versi npm yang sudah terbit, lalu menaikkan patch dari versi tertinggi tersebut.

Untuk perubahan dokumentasi atau perubahan internal yang tidak boleh menerbitkan npm, gunakan commit message yang memuat marker berikut:

```text
docs: update API reference [skip release]
```

Untuk memicu workflow secara manual, gunakan **Actions → Auto publish to npm → Run workflow**. Manual trigger tetap menjalankan versioning dan semua gate yang sama.

## Verifikasi lokal

Sebelum push, jalankan:

```bash
npm run typecheck
npm run test:types
npm run lint
npm test
npm run build
npm run security
npm run release:check
```

Setelah workflow selesai, verifikasi:

```bash
npm view @xbibzlibrary/telebibz version dist.integrity dist.tarball
npm view @xbibzlibrary/telebibz version --registry=https://npm.pkg.github.com
```

# GitHub-to-npm Release Automation

Repository ini menggunakan GitHub Actions untuk menjaga source GitHub dan package npmjs tetap sinkron melalui satu jalur release yang tervalidasi. Repository source tetap private; karena itu workflow menggunakan npm publish tanpa provenance, sesuai batasan registry npm untuk source private. GitHub digunakan sebagai source code, tempat workflow, tag, dan GitHub Release. Panduan GitHub Packages tersedia sebagai opsi terpisah jika organisasi GitHub dengan scope `xbibzlibrary` dibuat kemudian.

## Alur otomatis

Setiap push ke branch `main` menjalankan workflow `.github/workflows/auto-publish.yml`, kecuali commit tersebut memuat marker `[skip release]`.

| Tahap | Perilaku |
|---|---|
| Checkout | Mengambil seluruh history beserta tag (`fetch-depth: 0` + `fetch-tags: true`) agar analisis commit dan pembuatan tag akurat. |
| Install | Menjalankan `npm ci --ignore-scripts`. |
| Version | Membaca versi `package.json`, versi latest npm, dan commit sejak tag release terakhir, lalu memilih versi berikutnya (lihat aturan di bawah). |
| Verification | Menjalankan typecheck, type-level tests, lint, runtime tests, build ESM/CommonJS, security audit, dan release check. |
| Immutable guard | Menolak publish jika versi target sudah ada di npmjs. |
| Git sync | Commit otomatis `chore(release): vX.Y.Z [skip release]` (dilewati bila `package.json` sudah berada di versi target), membuat annotated tag `vX.Y.Z`, lalu push commit dan tag ke GitHub. |
| npmjs publish | Menerbitkan package public menggunakan `NPM_TOKEN`; provenance dinonaktifkan karena npm menolak provenance dari source repository private. |
| GitHub Release | Membuat GitHub Release dengan generated notes. |

Push commit version otomatis tidak memicu release kedua karena mengandung `[skip release]`. Workflow menggunakan concurrency sehingga release berjalan satu per satu.

## Aturan penomoran versi

Versi berikutnya dihitung dari `max(package.json, npm latest)` dengan bump berdasarkan Conventional Commits sejak tag release terakhir:

| Commit sejak tag terakhir | 0.x | >=1.0.0 |
|---|---|---|
| `BREAKING CHANGE:` atau `feat!:` / `fix!:` | minor (`0.1.19` → `0.2.0`) | major (`1.2.3` → `2.0.0`) |
| `feat:` / `feat(scope):` | minor | minor |
| lainnya (`fix:`, `docs:`, `chore:`, …) | patch | patch |

Jika `package.json` sudah dideklarasikan lebih tinggi daripada versi npm (misalnya dipersiapkan manual untuk `0.2.0`), workflow memakai versi tersebut apa adanya. Hasil perhitungan tidak pernah boleh lebih rendah daripada versi npm yang sudah terbit; jika demikian, workflow gagal dengan pesan yang jelas.

## Secret dan permission yang wajib tersedia

Workflow membutuhkan `contents: write` untuk version bump, tag, dan GitHub Release. Buka repository GitHub, kemudian masuk ke **Settings → Secrets and variables → Actions** dan tambahkan repository atau environment secret berikut:

```text
NPM_TOKEN=${NPM_TOKEN}
```

Jika memakai GitHub Environment bernama `npm-release`, secret dapat disimpan sebagai environment secret dan environment tersebut dapat diberi required reviewers untuk approval manual sebelum publish.

Jangan menyimpan token di repository, `.npmrc`, source code, issue, commit, atau workflow. Token npm yang pernah ditempelkan di chat harus dicabut dan diganti dengan granular token baru.

## Aturan penggunaan

Perubahan source biasa dapat dipush ke `main`; workflow menghitung versi baru berdasarkan Conventional Commits (`feat:` → minor, `fix:`/lainnya → patch, `feat!:`/`BREAKING CHANGE:` → minor pada 0.x / major pada 1.x) setelah seluruh quality gates lulus. Karena versi npm immutable, workflow tidak pernah menimpa versi yang telah ada.

Untuk rilis yang dipersiapkan secara eksplisit (misalnya `0.2.0` atau `1.0.0`), deklarasikan versi tersebut langsung di `package.json` sebelum push; workflow akan memakainya apa adanya selama lebih tinggi daripada versi npm yang sudah terbit.

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
```

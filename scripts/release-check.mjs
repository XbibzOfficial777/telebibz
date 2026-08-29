import { existsSync, readFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
expect(packageJson.name === "@xbibzlibrary/telebibz", "package name must be @xbibzlibrary/telebibz");
expect(packageJson.private !== true, "package must not be private for publish");
expect(packageJson.publishConfig?.access === "public", "publishConfig.access must be public");
expect(packageJson.publishConfig?.provenance === false, "publishConfig.provenance must be false for the private source repository");
expect(!packageJson.scripts?.preinstall && !packageJson.scripts?.install && !packageJson.scripts?.postinstall, "install lifecycle scripts are not allowed");
for (const path of ["dist", "dist-cjs", "README.md", "LICENSE", "SECURITY.md", "docs/API.md"]) expect(existsSync(resolve(root, path)), `required release path missing: ${path}`);
const secretPattern = /(?:npm_[A-Za-z0-9]{20,}|NPM_TOKEN\s*[:=]\s*[^\s$][^\s`"']+)/;
const scan = (directory) => { for (const entry of readdirSync(directory, { withFileTypes: true })) { if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "telebibz-0.1.0.tgz") continue; const path = resolve(directory, entry.name); if (entry.isDirectory()) scan(path); else if (/\.(?:ts|mjs|js|json|md|yml|yaml|txt)$/.test(entry.name)) { const content = readFileSync(path, "utf8"); if (secretPattern.test(content)) failures.push(`possible secret in ${path.replace(`${root}/`, "")}`); } } };
scan(root);
const packJson = JSON.parse(execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }));
const files = packJson[0]?.files?.map((file) => file.path) ?? [];
expect(files.includes("package.json"), "tarball must contain package.json");
expect(files.some((file) => file.startsWith("dist/")), "tarball must contain ESM dist");
expect(files.some((file) => file.startsWith("dist-cjs/")), "tarball must contain CommonJS dist");
expect(!files.some((file) => /(?:\.npmrc|mytoken|token\.txt)/i.test(file)), "tarball must not contain credential files");
for (const [binName, rawBinPath] of Object.entries(packageJson.bin ?? {})) {
  const binPath = rawBinPath.replace(/^\.\//, "");
  expect(files.includes(binPath), `tarball must contain the ${binName} bin entry: ${binPath}`);
  const binSource = readFileSync(resolve(root, binPath), "utf8");
  for (const match of binSource.matchAll(/from\s+["']([^"']+)["']/g)) {
    const specifier = match[1];
    if (!specifier.startsWith("../")) continue;
    const target = resolve(root, dirname(binPath), specifier);
    const relative = target.replace(`${root}/`, "");
    expect(files.includes(relative), `${binName} bin imports ${specifier}, which is missing from the tarball (expected ${relative})`);
  }
}
if (failures.length) { console.error(JSON.stringify({ status: "FAIL", failures }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "PASS", package: packageJson.name, version: packageJson.version, tarballFiles: files.length }, null, 2));

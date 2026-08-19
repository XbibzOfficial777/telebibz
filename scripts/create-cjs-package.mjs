import { mkdir, writeFile } from "node:fs/promises";
await mkdir("dist-cjs", { recursive: true });
await writeFile("dist-cjs/package.json", JSON.stringify({ type: "commonjs" }, null, 2));

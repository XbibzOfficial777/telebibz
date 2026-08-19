import { cp, mkdir } from "node:fs/promises";

const source = new URL("../src/api/telegram-types/", import.meta.url);
for (const output of [new URL("../dist/src/api/telegram-types/", import.meta.url), new URL("../dist-cjs/src/api/telegram-types/", import.meta.url)]) {
  await mkdir(output, { recursive: true });
  await cp(source, output, { recursive: true });
}

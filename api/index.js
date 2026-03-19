import { createRequestListener } from "@react-router/node";
import { existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

export const config = {
  includeFiles: ["build/**"],
};

const __dirname = dirname(fileURLToPath(import.meta.url));

let listener;

async function getListener() {
  if (!listener) {
    // Debug: verify build files exist
    const buildDir = join(__dirname, "..", "build");
    const serverBuildPath = join(buildDir, "server", "index.js");
    console.log("[fs] buildDir:", buildDir);
    console.log("[fs] buildDir exists:", existsSync(buildDir));
    console.log("[fs] server/index.js exists:", existsSync(serverBuildPath));
    if (existsSync(buildDir)) {
      console.log("[fs] build contents:", readdirSync(buildDir));
    }

    const build = await import(serverBuildPath);
    console.log("[build] keys:", Object.keys(build));

    // createRequestListener accepts the build directly in @react-router/node v7
    listener = createRequestListener(build);
  }
  return listener;
}

export default async function handler(req, res) {
  try {
    const handle = await getListener();
    await handle(req, res);
  } catch (err) {
    console.error("SSR Error:", String(err), err?.stack);
    res.statusCode = 500;
    res.end(`Internal Server Error: ${String(err)}`);
  }
}

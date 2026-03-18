import { createRequestListener } from "@react-router/node";

export const config = {
  includeFiles: ["build/**"],
};

let listener;

async function getListener() {
  if (!listener) {
    // Pass entire module namespace — not just .default
    const build = await import("../build/server/index.js");
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

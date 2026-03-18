import { createRequestListener } from "@react-router/node";
import * as reactRouter from "react-router";

export const config = {
  includeFiles: ["build/**"],
};

const createRequestHandler =
  reactRouter.createRequestHandler ?? reactRouter.default?.createRequestHandler;

let listener;

async function getListener() {
  if (!listener) {
    let build;
    try {
      build = await import("../build/server/index.js");
      console.log("[build] keys:", Object.keys(build));
      console.log("[build] default type:", typeof build.default);
      console.log("[build] default keys:", build.default ? Object.keys(build.default) : "none");
      console.log("[build] has routes:", "routes" in build, "has entry:", "entry" in build);
    } catch (importErr) {
      console.error("[build] IMPORT FAILED:", String(importErr));
      throw importErr;
    }

    // Try all possible shapes React Router v7 might export
    const serverBuild =
      build.default?.routes ? build.default :
      build.routes ? build :
      null;

    console.log("[build] serverBuild shape:", serverBuild ? Object.keys(serverBuild) : "NULL");

    if (!serverBuild) throw new Error("Could not resolve server build — no routes found");

    const reqHandler = createRequestHandler(serverBuild);
    listener = createRequestListener(reqHandler);
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

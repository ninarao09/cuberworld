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
    const build = await import("../build/server/index.js");
    console.log("build keys:", Object.keys(build));
    console.log("build.default type:", typeof build.default);
    console.log("build.default keys:", build.default ? Object.keys(build.default) : "none");
    const serverBuild = build.default ?? build;
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

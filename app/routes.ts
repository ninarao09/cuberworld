import { type RouteConfig, index, route, prefix } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("logout", "routes/logout.tsx"),
  route("pricing", "routes/pricing.tsx"),
  ...prefix("tutorials", [
    index("routes/tutorials._index.tsx"),
    route("cfop", "routes/tutorials.cfop.tsx"),
    route("roux", "routes/tutorials.roux.tsx"),
    route("blindfolded", "routes/tutorials.blindfolded.tsx"),
  ]),
  route("cube", "routes/cube.tsx"),
  route("analyzer", "routes/analyzer.tsx"),
  route("api/checkout", "routes/api.checkout.tsx"),
  route("api/webhook", "routes/api.webhook.tsx"),
  route("api/progress", "routes/api.progress.tsx"),
] satisfies RouteConfig;

import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(path.dirname(fileURLToPath(import.meta.url)), "../.."),
  transpilePackages: [
    "@cabinet/sim",
    "@cabinet/rules",
    "@cabinet/scenarios",
    "@cabinet/db",
    "@cabinet/runtime",
  ],
  serverExternalPackages: ["pg"],
};

export default nextConfig;

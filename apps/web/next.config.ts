import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The atlas is published on its own domain but is not its own deployment.
 *
 * The game keeps `/atlas` as an ordinary route; any of these hosts serve the
 * atlas at their root instead. One build, one set of static geometry, many
 * front doors. A host rewrite does this at the routing layer, so there is no
 * middleware to keep in step and no second copy of the map data to drift.
 *
 * `atlas.aevanor.com` is a working front door on a domain already delegated
 * to a real registrar, kept alongside `aevanormap.com` while that domain's
 * own DNS is still unconfigured.
 */
const ATLAS_HOSTS = ["aevanormap.com", "www.aevanormap.com", "atlas.aevanor.com"];

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(path.dirname(fileURLToPath(import.meta.url)), "../.."),
  transpilePackages: [
    "@cabinet/sim",
    "@cabinet/rules",
    "@cabinet/scenarios",
    "@cabinet/db",
    "@cabinet/runtime",
    "@cabinet/geo",
  ],
  serverExternalPackages: ["pg"],
  async rewrites() {
    return {
      beforeFiles: ATLAS_HOSTS.map((host) => ({
        source: "/",
        has: [{ type: "host" as const, value: host }],
        destination: "/atlas",
      })),
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        // Generated offline by infra/tiles and rebuilt only when a source
        // revises, so it can be cached hard and served from the edge.
        source: "/geo/mapkit/:file*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },
};

export default nextConfig;

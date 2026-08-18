# Atlas — aevanormap.com

The cartographic instrument for Cabinet. One Next.js app, two front doors:
the game keeps `/atlas` as an ordinary route; `aevanormap.com` serves the
same page at `/` via a host rewrite in `apps/web/next.config.ts`.

There is no second deployment and no second copy of the geometry. A map that
drifts from the game is a map that lies.

## What it is

A mid-century foreign-ministry situation map. Perspective is a restyle, not
a refetch: every boundary segment carries one property per government
(`pov_in`, `pov_pk`, `pov_neutral`, …). Switching from a disinterested
reading to Delhi's is a change of which property the ink is chosen by.

Start on Eastern Europe / Black Sea, 2026: aggregated provinces, cities,
strategic roads and gauged rail, with the Bosphorus as a closeable node.
The chrome-free world plate is `/atlas?sheet=world`. Kashmir remains a
sheet of its own: from Delhi the Line of Control is an international
boundary. From Islamabad it is an internal administrative line. To nobody
in particular it is a de facto military line with no agreed legal status.
All three ship in the same file.

Maritime zones are computed by equidistance from sampled coastline, not
traced. An EEZ is never filled like land — it is not territory.

## Local

```bash
npm run dev
# http://localhost:3000/atlas
```

Geometry lives in `apps/web/public/geo/mapkit/`, generated offline by
`infra/tiles`. Do not fetch tiles at request time.

## Publish aevanormap.com

Attach the domain to the **same** Vercel project that deploys `apps/web`.
A second project would fork the geometry.

1. Vercel → the Cabinet web project → Settings → Domains.
2. Add `aevanormap.com` and `www.aevanormap.com`.
3. At the registrar, CNAME both names to `cname.vercel-dns.com` (or the
   target Vercel prints). Apex can be an A record if the registrar will
   not CNAME it; Vercel documents the addresses on the domain screen.
4. Wait for HTTPS. The host rewrite is already in `next.config.ts`:
   requests whose Host is `aevanormap.com` or `www.aevanormap.com` and
   whose path is `/` are rewritten to `/atlas`.

`aevanormap.com` currently has no nameservers or records at the registrar —
adding it in Vercel alone does nothing until DNS actually delegates to
Vercel. Check with `dig NS aevanormap.com` before troubleshooting the app.

`atlas.aevanor.com` is wired into `ATLAS_HOSTS` as a working front door on a
domain that already resolves, for use while `aevanormap.com`'s DNS is
outstanding. Same steps: add the subdomain in Vercel → Domains, then add a
CNAME for `atlas` to `cname.vercel-dns.com` at the registrar. Any host can be
added the same way — extend the `ATLAS_HOSTS` array and repeat the two steps.

No `vercel.json` domain list is required. The rewrite is the contract.

This environment cannot attach the domain: the Vercel integration is not
authenticated here. After merge, add the names on the project that already
ships the game.

## Era

Historical tables inherit physical layers (coast, terrain, bathymetry) and
override political ones. A scenario may not render a layer its year did not
have:

- territorial sea is 3nm before 1982, 12nm after
- no contiguous zone before 1982
- no EEZ before UNCLOS enters force in 1994
- no flight information regions before 1947
- no motorway network before the 1950s

The `geo` block on each scenario in `packages/scenarios` states the year
and the theatre frame. The frame is the contested ground, not the union of
every great-power homeland.

## What this package must not do

`packages/sim` never imports `packages/geo`. Geometry is float-heavy;
one coordinate on the tick path would break byte-identical determinism.
Advisors never read the map. Planted intel paints identically to genuine
intel at equal confidence.

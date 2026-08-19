import type { Metadata } from "next";
import { AtlasShell } from "@/components/atlas/AtlasShell";
import "./atlas.css";

export const metadata: Metadata = {
  title: "Aevanor Atlas — a map is a claim, not a fact",
  description:
    "The world, from nobody's desk: real Natural Earth political boundaries and the two sovereignty-adjacent maritime zones — territorial sea and exclusive economic zone — computed by equidistance rather than traced.",
  openGraph: {
    title: "Aevanor Atlas — a map is a claim, not a fact",
    description:
      "One reference plate: political borders and maritime zones, nothing else. Scroll or pinch to zoom, drag to pan, bounded to the map's own frame.",
    type: "website",
  },
};

export default async function AtlasPage({
  searchParams,
}: {
  searchParams?: Promise<{ sheet?: string | string[] }>;
}) {
  const params = searchParams ? await searchParams : {};
  const raw = params.sheet;
  const sheetId = Array.isArray(raw) ? raw[0] : raw;
  return <AtlasShell sheetId={sheetId} />;
}

import type { Metadata } from "next";
import { AtlasShell } from "@/components/atlas/AtlasShell";
import "./atlas.css";

export const metadata: Metadata = {
  title: "Aevanor Atlas — a map is a claim, not a fact",
  description:
    "Eastern Europe and the Black Sea, 2026: aggregated provinces, cities, strategic roads and gauged rail, with the Bosphorus as a closeable node. The world plate remains at /atlas?sheet=world.",
  openGraph: {
    title: "Aevanor Atlas — a map is a claim, not a fact",
    description:
      "Stage 1 theatre: provinces, cities and roads from Poland through the Bosphorus. Scroll or pinch to zoom, drag to pan.",
    type: "website",
  },
};

export default async function AtlasPage({
  searchParams,
}: {
  searchParams: Promise<{ sheet?: string }>;
}) {
  const params = await searchParams;
  return <AtlasShell sheetId={params.sheet} />;
}

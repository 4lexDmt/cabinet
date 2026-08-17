import type { Metadata } from "next";
import { AtlasShell } from "@/components/atlas/AtlasShell";
import "./atlas.css";

export const metadata: Metadata = {
  title: "Aevanor Atlas — a map is a claim, not a fact",
  description:
    "One geometry, several beliefs about it. A reference cartographic instrument for Cabinet: real Natural Earth boundaries rendered from each government's own point of view, with maritime zones computed by equidistance rather than traced.",
  openGraph: {
    title: "Aevanor Atlas — a map is a claim, not a fact",
    description:
      "Switch perspective and contested boundaries redraw. From Delhi the Line of Control is an international boundary; from Islamabad it is an internal administrative line. Both ship in the same file.",
    type: "website",
  },
};

export default function AtlasPage() {
  return <AtlasShell />;
}

export function Claim({
  confidence,
  text,
  assessedPlanted = false,
}: {
  confidence: "confirmed" | "probable" | "unverified";
  text: string;
  assessedPlanted?: boolean;
}) {
  if (assessedPlanted) {
    return (
      <span className="claim planted">
        <span className="glyph" style={{ color: "var(--breach)" }} aria-label="planted">
          ⧅{" "}
        </span>
        {text}
      </span>
    );
  }
  if (confidence === "confirmed") {
    return (
      <span className="claim confirmed">
        <span className="glyph" aria-label="confirmed">
          ■{" "}
        </span>
        {text}
      </span>
    );
  }
  if (confidence === "probable") {
    return (
      <span className="claim probable">
        {text}
        <span className="glyph" aria-label="probable">
          {" "}
          ◧
        </span>
      </span>
    );
  }
  return (
    <span className="claim unverified">
      {text}
      <span className="glyph" style={{ color: "var(--uncertainty)" }} aria-label="unverified">
        {" "}
        □
      </span>
    </span>
  );
}

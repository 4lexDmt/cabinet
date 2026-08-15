/** Deterministic JSON: sorted keys, no whitespace variance. */
export function stableStringify(value: unknown): string {
  return stringify(value);
}

function stringify(value: unknown): string {
  if (value === null) return "null";
  const t = typeof value;
  if (t === "number") {
    if (!Number.isFinite(value)) throw new Error("non-finite number in state");
    return JSON.stringify(value);
  }
  if (t === "boolean" || t === "string") return JSON.stringify(value);
  if (t === "undefined") return "null";
  if (Array.isArray(value)) {
    return `[${value.map(stringify).join(",")}]`;
  }
  if (t === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    const parts: string[] = [];
    for (const k of keys) {
      const v = obj[k];
      if (v === undefined) continue;
      parts.push(`${JSON.stringify(k)}:${stringify(v)}`);
    }
    return `{${parts.join(",")}}`;
  }
  throw new Error(`unserializable ${t}`);
}

export function cloneState<T>(value: T): T {
  return structuredClone(value);
}

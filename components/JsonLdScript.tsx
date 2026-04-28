// H7 Sprint 18 G3 — JSON-LD script wrapper.
//
// Her sayfa structured data için <script type="application/ld+json"> render
// eder. `data` null ise hiç render yok (graceful) — liste boş, item yok gibi
// durumlarda.

export interface JsonLdScriptProps {
  data: Record<string, unknown> | null | undefined;
}

export function JsonLdScript({ data }: JsonLdScriptProps) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

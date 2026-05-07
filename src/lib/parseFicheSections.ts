export type FicheSection = { title: string; body: string };

export function parseFicheSections(texte: string | null | undefined): FicheSection[] {
  try {
    const parsed = JSON.parse(texte ?? "[]");
    if (Array.isArray(parsed)) {
      return parsed.map((s) => ({ title: s.title ?? "", body: s.body ?? "" }));
    }
  } catch {}
  return texte ? [{ title: "", body: texte }] : [];
}

import { auth } from "@/auth";
import { fetchObjetsPageData } from "./actions";
import ObjetsClient from "./ObjetsClient";

export const dynamic = "force-dynamic";

export default async function ObjetsPage() {
  const session = await auth();
  const compagnieId = Number(session!.activeCompanyId);

  const { typesObjets, categories, representations } = await fetchObjetsPageData(compagnieId);

  // Serialize dates for client component
  const serializedTypes = typesObjets.map((t) => ({
    ...t,
    objets: t.objets.map((o) => ({
      ...o,
      reservations: o.reservations.map((r) => ({
        ...r,
        representation: {
          ...r.representation,
          debutResa: r.representation.debutResa.toISOString(),
        },
      })),
    })),
  }));
  const serializedRepresentations = representations.map((r) => ({
    ...r,
    debutResa: r.debutResa.toISOString(),
  }));

  return (
    <ObjetsClient
      typesObjets={serializedTypes}
      categories={categories}
      representations={serializedRepresentations}
    />
  );
}

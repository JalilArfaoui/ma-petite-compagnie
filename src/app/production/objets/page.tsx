import { auth } from "@/auth";
import { fetchObjetsPageData } from "./actions";
import ObjetsClient from "./ObjetsClient";

export const dynamic = "force-dynamic";

export default async function ObjetsPage() {
  const session = await auth();
  const compagnieId = Number(session!.activeCompanyId);

  const { typesObjets, categories, representations } = await fetchObjetsPageData(compagnieId);

  // Serialize dates for client component
  const serializedTypes = JSON.parse(JSON.stringify(typesObjets));
  const serializedRepresentations = JSON.parse(JSON.stringify(representations));

  return (
    <ObjetsClient
      typesObjets={serializedTypes}
      categories={categories}
      representations={serializedRepresentations}
    />
  );
}

import { fetchObjetsPageData } from "./actions";
import ObjetsClient from "./ObjetsClient";

export const dynamic = "force-dynamic";

export default async function ObjetsPage() {
  const { typesObjets, categories, compagnies, representations } = await fetchObjetsPageData();

  // Serialize dates for client component
  const serializedTypes = JSON.parse(JSON.stringify(typesObjets));
  const serializedRepresentations = JSON.parse(JSON.stringify(representations));

  return (
    <ObjetsClient
      typesObjets={serializedTypes}
      categories={categories}
      compagnies={compagnies}
      representations={serializedRepresentations}
    />
  );
}

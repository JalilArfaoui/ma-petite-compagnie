export const dynamic = "force-dynamic";

import { getOperations, getNomsSpectacles } from "./finance-actions";
import AdminClient from "./AdminClient";
import { requireActiveCompanyAdministration } from "./auth-helpers";

export default async function PageAdministration() {
  await requireActiveCompanyAdministration();

  const recettes = await getOperations("RECETTE");
  const depenses = await getOperations("DEPENSE");
  const nomsSpectacles = await getNomsSpectacles();

  return (
    <AdminClient
      initialRecettes={recettes}
      initialDepenses={depenses}
      nomsSpectacles={nomsSpectacles}
    />
  );
}

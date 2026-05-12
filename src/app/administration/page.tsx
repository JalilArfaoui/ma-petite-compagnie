export const dynamic = "force-dynamic";

import { getOperations, getNomsSpectacles, getEquilibresSpectacles } from "./finance-actions";
import AdminClient from "./AdminClient";
import { requireActiveCompanyAdministration } from "./auth-helpers";

export default async function PageAdministration() {
  await requireActiveCompanyAdministration();

  const [recettes, depenses, nomsSpectacles, equilibresSpectacles] = await Promise.all([
    getOperations("RECETTE"),
    getOperations("DEPENSE"),
    getNomsSpectacles(),
    getEquilibresSpectacles(),
  ]);

  return (
    <AdminClient
      initialRecettes={recettes}
      initialDepenses={depenses}
      nomsSpectacles={nomsSpectacles}
      equilibresSpectacles={equilibresSpectacles}
    />
  );
}

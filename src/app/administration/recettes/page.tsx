export const dynamic = "force-dynamic";

import { getOperations, getNomsSpectacles } from "../finance-actions";
import RecettesClient from "./RecettesClient";
import { requireActiveCompanyAdministration } from "../auth-helpers";

export default async function RecettesPage() {
  await requireActiveCompanyAdministration();

  const recettes = await getOperations("RECETTE");
  const nomsSpectacles = await getNomsSpectacles();

  return <RecettesClient initialRecettes={recettes} nomsSpectacles={nomsSpectacles} />;
}

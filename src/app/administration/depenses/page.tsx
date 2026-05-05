export const dynamic = "force-dynamic";

import { getOperations, getNomsSpectacles } from "../finance-actions";
import DepensesClient from "./DepensesClient";
import { requireActiveCompanyAdministration } from "../auth-helpers";

export default async function DepensesPage() {
  await requireActiveCompanyAdministration();

  const depenses = await getOperations("DEPENSE");
  const nomsSpectacles = await getNomsSpectacles();

  return <DepensesClient initialDepenses={depenses} nomsSpectacles={nomsSpectacles} />;
}

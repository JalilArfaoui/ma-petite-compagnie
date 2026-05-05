export const dynamic = "force-dynamic";

import { getEquilibresSpectacles } from "../finance-actions";
import { requireActiveCompanyAdministration } from "../auth-helpers";
import EquilibreFinancierClient from "./EquilibreFinancierClient";

export default async function EquilibreFinancierPage() {
  await requireActiveCompanyAdministration();

  const spectacles = await getEquilibresSpectacles();

  return <EquilibreFinancierClient spectacles={spectacles} />;
}

import { getOperations, getNomsSpectacles } from "../finance-actions";
import DepensesClient from "./DepensesClient";

export default async function DepensesPage() {
  const depenses = await getOperations("DEPENSE");
  const nomsSpectacles = await getNomsSpectacles();

  return <DepensesClient initialDepenses={depenses} nomsSpectacles={nomsSpectacles} />;
}

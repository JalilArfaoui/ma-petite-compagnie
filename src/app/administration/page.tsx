import { getOperations, getNomsSpectacles } from "./finance-actions";
import AdminClient from "./AdminClient";

export default async function PageAdministration() {
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

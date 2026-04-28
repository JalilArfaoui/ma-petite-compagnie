import { getOperations, getNomsSpectacles } from "../finance-actions";
import RecettesClient from "./RecettesClient";

export default async function RecettesPage() {
  const recettes = await getOperations("RECETTE");
  const nomsSpectacles = await getNomsSpectacles();

  return <RecettesClient initialRecettes={recettes} nomsSpectacles={nomsSpectacles} />;
}

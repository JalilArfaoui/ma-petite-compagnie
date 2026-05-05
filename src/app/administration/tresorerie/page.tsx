export const dynamic = "force-dynamic";

import { requireActiveCompanyAdministration } from "../auth-helpers";
import { getTresorerieReelle } from "../finance-actions";
import TresorerieClient from "./TresorerieClient";

export default async function TresoreriePage() {
  await requireActiveCompanyAdministration();

  const tresorerie = await getTresorerieReelle();

  return <TresorerieClient tresorerie={tresorerie} />;
}

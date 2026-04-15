import { Box, Flex, Text } from "@/components/ui";

export function HTMLFacturePreview({ data }: { data: any }) {
  const totalHT = data.lignes.reduce((acc: number, l: any) => acc + l.quantite * l.prixUnitaireHT, 0);
  const totalTVA = data.lignes.reduce(
    (acc: number, l: any) => acc + l.quantite * l.prixUnitaireHT * (l.tva / 100),
    0
  );
  const totalTTC = totalHT + totalTVA;

  const formatDate = (d: string) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("fr-FR");
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
  };

  return (
    <Box className="bg-white p-8 h-full overflow-y-auto text-slate-800 font-sans text-sm outline-none">
      <Flex justify="between" className="mb-12">
        <Box className="w-1/2">
          <Text className="font-bold text-lg mb-1">{data.compagnie.nom}</Text>
          {data.compagnie.adresse && <Text>{data.compagnie.adresse}</Text>}
          {(data.compagnie.codePostal || data.compagnie.ville) && (
            <Text>{`${data.compagnie.codePostal || ""} ${data.compagnie.ville || ""}`}</Text>
          )}
          {data.compagnie.siteWeb && (
            <Text className="mt-1 text-blue-600">{data.compagnie.siteWeb}</Text>
          )}
        </Box>
        <Box className="w-1/2 text-right">
          <Text className="text-slate-500 mb-1">Facturé à :</Text>
          <Text className="font-bold text-base">{data.clientNom}</Text>
          {data.clientAdresse && <Text className="whitespace-pre-wrap">{data.clientAdresse}</Text>}
        </Box>
      </Flex>

      <Box className="mb-8">
        <Text className="text-xl font-bold mb-2">FACTURE N° {data.numero}</Text>
        <Text>Date d'émission : {formatDate(data.dateEmission)}</Text>
        {data.lieuFacturation && <Text>Lieu : {data.lieuFacturation}</Text>}
        <Text>Date d'échéance : {formatDate(data.dateEcheance)}</Text>
      </Box>

      <table className="w-full text-left border-collapse mb-8">
        <thead>
          <tr className="bg-slate-100 uppercase text-xs tracking-wider border-y">
            <th className="py-2 px-3">Désignation</th>
            <th className="py-2 px-3 text-right">Qté</th>
            <th className="py-2 px-3 text-right">P.U. HT</th>
            <th className="py-2 px-3 text-right">TVA</th>
            <th className="py-2 px-3 text-right">Total HT</th>
          </tr>
        </thead>
        <tbody>
          {data.lignes.map((ligne: any, i: number) => (
            <tr key={i} className="border-b text-sm">
              <td className="py-3 px-3">{ligne.designation || "-"}</td>
              <td className="py-3 px-3 text-right">{ligne.quantite}</td>
              <td className="py-3 px-3 text-right">{formatCurrency(ligne.prixUnitaireHT)}</td>
              <td className="py-3 px-3 text-right">{ligne.tva}%</td>
              <td className="py-3 px-3 text-right">
                {formatCurrency(ligne.quantite * ligne.prixUnitaireHT)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Flex justify="end" className="mb-12">
        <Box className="w-1/2 bg-slate-50 p-4 rounded-lg">
          <Flex justify="between" className="mb-2">
            <Text className="font-medium text-slate-500">Total HT :</Text>
            <Text>{formatCurrency(totalHT)}</Text>
          </Flex>
          <Flex justify="between" className="mb-4">
            <Text className="font-medium text-slate-500">Total TVA :</Text>
            <Text>{formatCurrency(totalTVA)}</Text>
          </Flex>
          <Flex justify="between" className="pt-2 border-t border-slate-200">
            <Text className="font-bold text-lg">Total TTC :</Text>
            <Text className="font-bold text-lg">{formatCurrency(totalTTC)}</Text>
          </Flex>
        </Box>
      </Flex>

      {data.compagnie.rib && (
        <Box className="mb-8 p-4 bg-slate-50 rounded-lg text-xs">
          <Text className="font-bold mb-1 col-span-2">Informations Bancaires (RIB) :</Text>
          <Text className="break-all">{data.compagnie.rib}</Text>
        </Box>
      )}

      <Box className="text-center text-xs text-slate-400 mt-20 pt-4 border-t">
        <Text>Merci de votre confiance.</Text>
        <Text>
          {data.compagnie.nom} - {data.compagnie.siteWeb}
        </Text>
      </Box>
    </Box>
  );
}

"use client";

import { useState, useTransition, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  Heading,
  Flex,
  Card,
  SimpleGrid,
} from "@/components/ui";
import { toast } from "sonner";
import { Compagnie, Facture, LigneFacture } from "@prisma/client";
import { generateFacturePDF } from "@/lib/pdf/facture";
import { creerFacture, updateFacture } from "@/app/actions/finance";
import { LuPlus, LuTrash2, LuSave, LuCheck } from "react-icons/lu";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LigneType = "PRESTATION" | "FRAIS" | "REDUCTION";

type LigneForm = {
  designation: string;
  quantite: number;
  prixUnitaireHT: number;
  tva: number;
  type: LigneType;
};

export type FactureComplete = Facture & { lignes: LigneFacture[] };

export function FactureEditor({
  compagnie,
  initialFacture,
}: {
  compagnie: Compagnie;
  initialFacture?: FactureComplete;
}) {
  const [isPending, startTransition] = useTransition();
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);
  const router = useRouter();

  // Form State — pré-rempli si édition d'un brouillon existant
  const defaultEcheance = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  };

  const [dateEmission, setDateEmission] = useState<string>(
    initialFacture
      ? new Date(initialFacture.dateEmission).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [dateEcheance, setDateEcheance] = useState<string>(
    initialFacture?.dateEcheance
      ? new Date(initialFacture.dateEcheance).toISOString().split("T")[0]
      : defaultEcheance()
  );
  const [lieu, setLieu] = useState<string>(
    initialFacture?.lieuFacturation || compagnie.ville || ""
  );
  const [clientNom, setClientNom] = useState<string>(initialFacture?.clientNom || "");
  const [clientAdresse, setClientAdresse] = useState<string>(
    initialFacture?.clientAdresse || ""
  );
  const [clientSiren, setClientSiren] = useState<string>(
    initialFacture?.clientSiren || ""
  );
  const [numeroManuel, setNumeroManuel] = useState<string>(
    initialFacture && !initialFacture.numero.startsWith("DRAFT-")
      ? initialFacture.numero
      : ""
  );

  const [lignes, setLignes] = useState<LigneForm[]>(
    initialFacture?.lignes.map((l) => ({
      designation: l.designation,
      quantite: l.quantite,
      prixUnitaireHT: l.prixUnitaireHT,
      tva: 0, // toujours 0 (association non assujettie TVA)
      type: l.type as LigneType,
    })) || [
      {
        designation: "Prestation standard",
        quantite: 1,
        prixUnitaireHT: 0,
        tva: 0,
        type: "PRESTATION",
      },
    ]
  );

  const pdfData = {
    numero: initialFacture?.numero || numeroManuel || "BROUILLON",
    dateEmission,
    dateEcheance: dateEcheance || "Non définie",
    lieuFacturation: lieu,
    clientNom,
    clientAdresse,
    clientSiren,
    lignes,
    compagnie: {
      nom: compagnie.nom,
      adresse: compagnie.adresse,
      ville: compagnie.ville,
      codePostal: compagnie.codePostal,
      siteWeb: compagnie.siteWeb,
      rib: compagnie.rib,
    },
  };

  const [pdfUrl, setPdfUrl] = useState<string>("");
  const lastPdfDataRef = useRef<string>("");

  const refreshPdf = useCallback(() => {
    try {
      const currentDataStr = JSON.stringify(pdfData);
      if (currentDataStr !== lastPdfDataRef.current) {
        const url = generateFacturePDF(pdfData);
        setPdfUrl(url);
        lastPdfDataRef.current = currentDataStr;
      }
    } catch (err) {
      console.error("Erreur génération PDF:", err);
    }
  }, [pdfData]);

  useEffect(() => {
    refreshPdf();
  }, []);

  const handleAddLine = () => {
    setLignes([...lignes, { designation: "", quantite: 1, prixUnitaireHT: 0, tva: 0, type: "PRESTATION" }]);
    setTimeout(refreshPdf, 0);
  };

  const handleRemoveLine = (index: number) => {
    setLignes(lignes.filter((_, i) => i !== index));
    setTimeout(refreshPdf, 0);
  };

  const updateLine = <K extends keyof LigneForm>(
    index: number,
    field: K,
    value: LigneForm[K]
  ) => {
    const newLignes = [...lignes];
    newLignes[index] = { ...newLignes[index], [field]: value };
    setLignes(newLignes);
  };

  const handleSubmit = async (estBrouillon: boolean) => {
    // Ne bloquer que si on émet (pas pour un brouillon)
    if (!estBrouillon) {
      setHasAttemptedSave(true);
      if (!clientNom || !dateEcheance || !clientAdresse) {
        toast.error("Veuillez remplir le nom du client, son adresse et la date d'échéance.");
        return;
      }
    }

    startTransition(async () => {
      try {
        const payload = {
          numero: numeroManuel || undefined,
          dateEcheance: new Date(dateEcheance || Date.now()),
          lieuFacturation: lieu,
          clientNom: clientNom,
          clientAdresse,
          clientSiren,
          lignes,
          estBrouillon,
        };

        if (initialFacture?.id) {
          await updateFacture(initialFacture.id, payload);
          // redirect handled server-side
        } else {
          await creerFacture(payload);
          // redirect handled server-side
        }
      } catch (err: any) {
        // redirect throws NEXT_REDIRECT, which is not a real error
        if (err?.message?.includes("NEXT_REDIRECT")) return;
        console.error(err);
        toast.error(err.message || "Erreur lors de l'enregistrement de la facture");
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      refreshPdf();
    }
  };

  return (
    <Flex gap={6} className="h-[calc(100vh-120px)]">
      <Box className="w-1/2 overflow-y-auto pr-2 pb-10" onBlur={refreshPdf} onKeyDown={handleKeyDown}>
        <Stack gap={6}>
          {!initialFacture && <Heading as="h2">Nouvelle Facture</Heading>}

          <Card className="p-6">
            <Stack gap={4}>
              <Flex justify="between" align="center">
                <Heading as="h4" className="text-lg">Informations Générales</Heading>
                <Link href="/profil" target="_blank" className="text-xs text-primary hover:underline">
                  Modifier la compagnie
                </Link>
              </Flex>
              <SimpleGrid columns={2} gap={4}>
                <Box>
                  <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Date émission
                  </Text>
                  <Input
                    type="date"
                    value={dateEmission}
                    onChange={(e) => setDateEmission(e.target.value)}
                  />
                </Box>
                <Box>
                  <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Date échéance *
                  </Text>
                  <Input
                    type="date"
                    value={dateEcheance}
                    onChange={(e) => setDateEcheance(e.target.value)}
                    className={hasAttemptedSave && !dateEcheance ? "border-red-500 focus:ring-red-500" : ""}
                    required
                  />
                </Box>
              </SimpleGrid>
              <Box>
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Lieu de facturation
                </Text>
                <Input
                  value={lieu}
                  onChange={(e) => setLieu(e.target.value)}
                  placeholder={compagnie.ville || "Paris"}
                />
              </Box>
              <Box className="mt-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <Text className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">
                  Numéro de facture forcé
                </Text>
                <Input
                  value={numeroManuel}
                  onChange={(e) => setNumeroManuel(e.target.value)}
                  placeholder="Ex: FACT-2026-050 (Laissez vide pour auto-générer)"
                />
                <Text className="text-xs text-amber-600 mt-1">
                  ⚠️ Modifier manuellement le numéro peut créer des doublons ou des trous dans votre comptabilité. Laissez vide si vous n'êtes pas sûr.
                </Text>
              </Box>
            </Stack>
          </Card>

          <Card className="p-6">
            <Stack gap={4}>
              <Heading as="h4" className="text-lg">Client</Heading>
              <Box>
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Nom du client / Entreprise *
                </Text>
                <Input
                  value={clientNom}
                  onChange={(e) => setClientNom(e.target.value)}
                  placeholder="Nom du client"
                  className={hasAttemptedSave && !clientNom ? "border-red-500 focus:ring-red-500" : ""}
                />
              </Box>
              <Box>
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Adresse du client *
                </Text>
                <Input
                  value={clientAdresse}
                  onChange={(e) => setClientAdresse(e.target.value)}
                  placeholder="Adresse complète"
                  className={hasAttemptedSave && !clientAdresse ? "border-red-500 focus:ring-red-500" : ""}
                  required
                />
              </Box>
              <Box>
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  SIREN ou N° TVA du client (Obligatoire pour les pros)
                </Text>
                <Input
                  value={clientSiren}
                  onChange={(e) => setClientSiren(e.target.value)}
                  placeholder="123 456 789"
                />
              </Box>
            </Stack>
          </Card>

          <Card className="p-6">
            <Stack gap={4}>
              <Heading as="h4" className="text-lg">Lignes de la facture</Heading>
              {lignes.map((ligne, i) => (
                <Box key={i} className="p-4 border rounded-xl relative bg-slate-50/50">
                  <button
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition"
                    onClick={() => handleRemoveLine(i)}
                    title="Supprimer la ligne"
                  >
                    <LuTrash2 size={18} />
                  </button>
                  <Stack gap={3}>
                    <Box className="w-1/3">
                      <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Type</Text>
                      <select
                        className="w-full p-2 text-sm border rounded-lg bg-white"
                        value={ligne.type}
                        onChange={(e) => updateLine(i, "type", e.target.value as LigneType)}
                      >
                        <option value="PRESTATION">Prestation</option>
                        <option value="FRAIS">Frais</option>
                        <option value="REDUCTION">Réduction</option>
                      </select>
                    </Box>
                    <Box>
                      <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Désignation</Text>
                      <Input
                        value={ligne.designation}
                        onChange={(e) => updateLine(i, "designation", e.target.value)}
                        placeholder="Description..."
                      />
                    </Box>
                    <Flex gap={3}>
                      <Box className="w-[30%]">
                        <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Qté</Text>
                        <Input
                          type="number"
                          value={ligne.quantite}
                          onChange={(e) => updateLine(i, "quantite", parseFloat(e.target.value) || 0)}
                        />
                      </Box>
                      <Box className="w-[70%]">
                        <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Prix unitaire</Text>
                        <Input
                          type="number"
                          step="0.01"
                          value={ligne.prixUnitaireHT}
                          onChange={(e) => updateLine(i, "prixUnitaireHT", parseFloat(e.target.value) || 0)}
                        />
                      </Box>
                    </Flex>
                  </Stack>
                </Box>
              ))}
              <Button onClick={handleAddLine} variant="outline" icon={<LuPlus />}>
                Ajouter une ligne
              </Button>
            </Stack>
          </Card>

          <Flex gap={4} className="mt-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleSubmit(true)}
              disabled={isPending}
              icon={<LuSave />}
              className="w-1/2"
            >
              Enregistrer en brouillon
            </Button>
            <Button
              size="lg"
              onClick={() => handleSubmit(false)}
              disabled={isPending}
              icon={<LuCheck />}
              className="w-1/2"
            >
              Émettre la facture
            </Button>
          </Flex>
        </Stack>
      </Box>

      {/* Aperçu PDF */}
      <Box className="w-1/2 h-full bg-slate-100 rounded-xl overflow-hidden shadow-inner border relative group">
        {pdfUrl ? (
          <iframe src={pdfUrl} className="w-full h-full border-none rounded-xl" />
        ) : (
          <Flex className="w-full h-full items-center justify-center text-slate-400">
            Chargement de l'aperçu PDF...
          </Flex>
        )}
      </Box>
    </Flex>
  );
}

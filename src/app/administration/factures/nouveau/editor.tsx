"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { createToaster } from "@chakra-ui/react";
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  Heading,
  Grid,
  Flex,
  IconButton,
  Separator,
} from "@chakra-ui/react";
import { Card } from "@/components/ui/Card/Card"; // Import directly or from ui index
// or import { Card } from "@/components/ui" if it works. Let's use direct to be safe or index
import { Toaster, toaster } from "@/components/ui/toaster";
import { Compagnie, LigneType } from "@prisma/client";
import { PDFFacture } from "@/components/finance/PDFFacture";
import { creerFacture } from "@/app/actions/finance";

// Dynamic import for PDFViewer
const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => <Box p={4}>Chargement de l'aperçu...</Box>,
});

type LigneForm = {
  designation: string;
  quantite: number;
  prixUnitaireHT: number;
  tva: number;
  type: LigneType;
};

export function FactureEditor({ compagnie }: { compagnie: Compagnie }) {
  const [isPending, startTransition] = useTransition();

  // Form State
  const [dateEmission, setDateEmission] = useState<string>(new Date().toISOString().split("T")[0]);
  const [dateEcheance, setDateEcheance] = useState<string>("");
  const [lieu, setLieu] = useState<string>(compagnie.ville || "");
  const [clientNom, setClientNom] = useState<string>("");
  const [clientAdresse, setClientAdresse] = useState<string>("");

  const [lignes, setLignes] = useState<LigneForm[]>([
    {
      designation: "Prestation standard",
      quantite: 1,
      prixUnitaireHT: 0,
      tva: 20,
      type: "PRESTATION",
    },
  ]);

  const pdfData = {
    numero: "BROUILLON",
    dateEmission,
    dateEcheance: dateEcheance || "Non définie",
    lieuFacturation: lieu,
    clientNom: clientNom || "Client",
    clientAdresse,
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

  const handleAddLine = () => {
    setLignes([
      ...lignes,
      { designation: "", quantite: 1, prixUnitaireHT: 0, tva: 20, type: "PRESTATION" },
    ]);
  };

  const handleRemoveLine = (index: number) => {
    setLignes(lignes.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: keyof LigneForm, value: any) => {
    const newLignes = [...lignes];
    newLignes[index] = { ...newLignes[index], [field]: value };
    setLignes(newLignes);
  };

  const handleSubmit = async () => {
    if (!clientNom || !dateEcheance) {
      toaster.create({
        title: "Champs manquants",
        description: "Veuillez remplir le nom du client et la date d'échéance.",
        type: "error",
      });
      return;
    }

    startTransition(async () => {
      try {
        await creerFacture({
          dateEcheance: new Date(dateEcheance),
          lieuFacturation: lieu,
          clientNom,
          clientAdresse,
          lignes,
        });
        toaster.create({ title: "Facture créée avec succès", type: "success" });
      } catch (err) {
        console.error(err);
        toaster.create({ title: "Erreur lors de la création", type: "error" });
      }
    });
  };

  return (
    <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} h="calc(100vh - 100px)">
      <Box overflowY="auto" p={4}>
        <Stack gap={6}>
          <Heading size="lg">Nouvelle Facture</Heading>

          <Card>
            <Card.Body>
              <Stack gap={4}>
                <Heading size="sm">Informations Générales</Heading>
                <Grid templateColumns="1fr 1fr" gap={4}>
                  <Box>
                    <Text mb={1} fontWeight="bold">
                      Date émission
                    </Text>
                    <Input
                      type="date"
                      value={dateEmission}
                      onChange={(e) => setDateEmission(e.target.value)}
                    />
                  </Box>
                  <Box>
                    <Text mb={1} fontWeight="bold">
                      Date échéance *
                    </Text>
                    <Input
                      type="date"
                      value={dateEcheance}
                      onChange={(e) => setDateEcheance(e.target.value)}
                      required
                    />
                  </Box>
                </Grid>
                <Box>
                  <Text mb={1} fontWeight="bold">
                    Lieu de facturation
                  </Text>
                  <Input
                    value={lieu}
                    onChange={(e) => setLieu(e.target.value)}
                    placeholder={compagnie.ville || "Paris"}
                  />
                </Box>
              </Stack>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Stack gap={4}>
                <Heading size="sm">Client</Heading>
                <Box>
                  <Text mb={1} fontWeight="bold">
                    Nom du client / Entreprise *
                  </Text>
                  <Input
                    value={clientNom}
                    onChange={(e) => setClientNom(e.target.value)}
                    placeholder="Nom du client"
                  />
                </Box>
                <Box>
                  <Text mb={1} fontWeight="bold">
                    Adresse du client
                  </Text>
                  <Input
                    value={clientAdresse}
                    onChange={(e) => setClientAdresse(e.target.value)}
                    placeholder="Adresse complète"
                  />
                </Box>
              </Stack>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Stack gap={4}>
                <Heading size="sm">Lignes de la facture</Heading>
                {lignes.map((ligne, i) => (
                  <Box key={i} p={4} borderWidth={1} borderRadius="md" position="relative">
                    <Button
                      size="xs"
                      position="absolute"
                      top={2}
                      right={2}
                      colorPalette="red"
                      variant="outline"
                      onClick={() => handleRemoveLine(i)}
                    >
                      X
                    </Button>
                    <Stack gap={2}>
                      <Box>
                        <Text fontSize="xs">Type</Text>
                        <select
                          style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                          }}
                          value={ligne.type}
                          onChange={(e) => updateLine(i, "type", e.target.value)}
                        >
                          <option value="PRESTATION">Prestation</option>
                          <option value="FRAIS">Frais</option>
                          <option value="REDUCTION">Réduction</option>
                        </select>
                      </Box>
                      <Box>
                        <Text fontSize="xs">Désignation</Text>
                        <Input
                          value={ligne.designation}
                          onChange={(e) => updateLine(i, "designation", e.target.value)}
                          placeholder="Description..."
                        />
                      </Box>
                      <Flex gap={2}>
                        <Box w="20%">
                          <Text fontSize="xs">Qté</Text>
                          <Input
                            type="number"
                            value={ligne.quantite}
                            onChange={(e) => updateLine(i, "quantite", parseFloat(e.target.value))}
                          />
                        </Box>
                        <Box w="30%">
                          <Text fontSize="xs">Prix U. HT</Text>
                          <Input
                            type="number"
                            step="0.01"
                            value={ligne.prixUnitaireHT}
                            onChange={(e) =>
                              updateLine(i, "prixUnitaireHT", parseFloat(e.target.value))
                            }
                          />
                        </Box>
                        <Box w="20%">
                          <Text fontSize="xs">TVA %</Text>
                          <Input
                            type="number"
                            value={ligne.tva}
                            onChange={(e) => updateLine(i, "tva", parseFloat(e.target.value))}
                          />
                        </Box>
                      </Flex>
                    </Stack>
                  </Box>
                ))}
                <Button onClick={handleAddLine} variant="outline" size="sm">
                  + Ajouter une ligne
                </Button>
              </Stack>
            </Card.Body>
          </Card>

          <Button size="lg" colorPalette="blue" onClick={handleSubmit} loading={isPending}>
            Générer la facture
          </Button>
        </Stack>
      </Box>

      <Box h="100%" bg="gray.100" borderRadius="md" overflow="hidden">
        <PDFViewer width="100%" height="100%" style={{ border: "none" }}>
          <PDFFacture data={pdfData} />
        </PDFViewer>
      </Box>
    </Grid>
  );
}

"use client";

import {useState} from "react";
import {Categorie} from "@prisma/client";
import {Field, GridItem} from "@chakra-ui/react";
import {Button, Input, SimpleGrid} from "@/components/ui";

type Props = {
    onSuccess: (categorie:Categorie) => void;
    onCancel: () => void;
    idCompagnie: number;
};

export function CreateCategorieForm({ onSuccess, onCancel, idCompagnie }: Props) {
    const [nom, setNom] = useState("");
    const [couleur, setCouleur] = useState("#000000");

    async function handleSubmitCategorie(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const res = await fetch("/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom, idCompagnie }),
        });

        if (!res.ok) {
            alert("La création d'une catégorie a échoué");
            return;
        }

        const categorie: Categorie = await res.json();

        onSuccess(categorie);
    }

    return (
        <form onSubmit={handleSubmitCategorie}>
            <Field.Root required>
                <Field.Label>
                    Nom <Field.RequiredIndicator />
                </Field.Label>
                <Input
                    type="text"
                    placeholder={"Répétition"}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                />
            </Field.Root>
            <Field.Root>
                <Field.Label>
                        Couleur
                </Field.Label>
                {/* TODO montrer une card représentative d'un évènement pour montrer la couleur */}
                <Input
                    type="color"
                    value={couleur}
                    onChange={(e) => setCouleur(e.target.value)}/>
            </Field.Root>
            <SimpleGrid columns={{ base: 4, md: 5 }} gap={{ base: "0px", md: "0px" }}>
                <GridItem colSpan={{ base: 1, md: 1 }}></GridItem>
                <GridItem colSpan={{ base: 1, md: 1 }}>
                    <Button type="button" onClick={onCancel}>
                        Annuler
                    </Button>
                </GridItem>
                <GridItem colSpan={{ base: 1, md: 1}}></GridItem>
                <GridItem colSpan={{ base: 1, md: 1 }}>
                    <Button type="submit" disabled={!nom}>
                        Créer
                    </Button>
                </GridItem>
            </SimpleGrid>
        </form>
    )
}
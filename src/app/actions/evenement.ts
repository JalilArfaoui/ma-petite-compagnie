"use server"

import { prisma } from "@/lib/prisma"

export async function creerEvenement(formData: FormData) {
    const nom = formData.get("nom") as string
    const lieuId = Number(formData.get("lieuId"))
    const compagnieId = 1
    const categorieId = Number(formData.get("categorieId"))
    const dateDebut = formData.get("dateDebut") as string
    const dateFin = formData.get("dateFin") as string
    try {
        if (!nom || !compagnieId || !lieuId || !categorieId || !dateDebut || !dateFin) {
            return { message: "Des informations sont manquantes, l'évènement ne peux pas être créé.", status: 400,
                evenement:null}
        }

        if (new Date(dateFin) <= new Date(dateDebut)) {
            return { message: "Le début de l'évènement doit précéder la date de fin.", status: 400 , evenement:null}
        }

        // TODO Vérifier que l'évènement ne créer pas un conflict
        // TODO Vérifier les droits de l'utilisateur
        const evenement = await prisma.evenement.create({
            data: {
                nom,
                dateDebut: new Date(dateDebut),
                dateFin: new Date(dateFin),
                compagnie: { connect: { id: compagnieId } },
                lieu: { connect: { id: lieuId } },
                categorie: { connect: { id: categorieId } }
            }
        })

        return {message:"",evenement:evenement, status: 201 }


    } catch (error) {
        console.error(error)
        return { message: "Erreur serveur", status: 500 , evenement:null}
    }
}
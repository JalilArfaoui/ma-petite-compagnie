"use server"

import { prisma } from "@/lib/prisma"
import {NextResponse} from "next/server";

type CreateEvenementBody = {
    nom: string
    compagnieId: number
    lieuId: number
    categorieId: number
    dateDebut: string
    dateFin: string
}

export async function creerEvenement(formData: FormData) {
    const nom = formData.get("nom") as string
    const lieuId = Number(formData.get("lieuId"))
    const compagnieId = 1
    const categorieId = Number(formData.get("categorieId"))
    const dateDebut = formData.get("dateDebut") as string
    const dateFin = formData.get("dateFin") as string
    try {
        if (!nom || !compagnieId || !lieuId || !categorieId || !dateDebut || !dateFin) {
            return NextResponse.json(
                { message: "Des informations sont manquantes, l'évènement ne peux pas être créé." },
                { status: 400 }
            )
        }

        if (new Date(dateFin) <= new Date(dateDebut)) {
            return NextResponse.json(
                { message: "Le début de l'évènement doit précéder la date de fin." },
                { status: 400 }
            )
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

        return NextResponse.json(evenement, { status: 201 })


    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: "Erreur serveur" },
            { status: 500 }
        )
    }
}
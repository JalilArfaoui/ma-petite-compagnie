import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"


type CreateEvenementBody = {
    nom: string
    compagnieId: number
    lieuId: number
    typeId: number
    dateDebut: string
    dateFin: string
}

/**
 * Ajout d'un évènement.
 * La date de début doit être strictement supérieur à la date de fin.
 * Un évènement ne peut contenir un participant ou un lieu déjà utilisé par un
 * autre évènement sur la même temporalité. Un évènement ne peut être créé
 * uniquement par des utilisateurs possédant ce droit.
 * @param req
 * @constructor
 */
export async function POST(req: NextRequest) {
    try {
        const body: CreateEvenementBody = await req.json()
        const {
            nom,
            compagnieId,
            lieuId,
            typeId,
            dateDebut,
            dateFin
        } = body

        if (!nom || !compagnieId || !lieuId || !typeId || !dateDebut || !dateFin) {
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
                type: { connect: { id: typeId } }
            },
            include: { participants: true }
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
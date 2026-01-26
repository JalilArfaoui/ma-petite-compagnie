import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

type CreateCompagnieBody = {
    nom: string,
    utilisateurId: number
}

export async function POST(req:NextRequest) {
    try {
        const body :CreateCompagnieBody = await req.json();
        const {
            nom,
            utilisateurId
        } = body;
        if (!nom || !utilisateurId) {
            return NextResponse.json(
                { message: "Des informations sont manquantes." },
                { status: 400 }
            )
        }

        // On vérifie que l'utilisateur qui crée la compagnie existe dans la bd
        const utilisateur = await prisma.utilisateurBouchon.findUnique({
            where: { id: utilisateurId }
        })

        if (!utilisateur) {
            return NextResponse.json(
                { message: "Utilisateur introuvable" },
                { status: 404 }
            )
        }

        const result = await prisma.$transaction(async (tx) => {
            const compagnie = await tx.compagnie.create({
                data: {
                    nom
                }
            })
            // on met à jour le status de l'utilisateur qui crée la compagnie
            // les droits de modification et l'id de la compagnie.
            const utilisateurMisAJour = await tx.utilisateurBouchon.update({
                where: { id: utilisateurId },
                data: {
                    compagnieId: compagnie.id,
                    droitModificationPlanification: true
                }
            })


            return { compagnie, utilisateur: utilisateurMisAJour }
        })
        return NextResponse.json(result, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: "Erreur serveur" },
            { status: 500 }
        )
    }
}
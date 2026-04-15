"use server"

import { prisma } from "@/lib/prisma"

export async function ajouterParticipant(idEvenement:number, idUtilisateur: number) {
    try {
        if (!idEvenement || !idUtilisateur) {
            return { message: "Des informations sont manquantes", status: 400, participant:null}
        }
        const participant = await prisma.participantsEvenement.create({
            data:{
                evenementId:idEvenement,
                utilisateurId:idUtilisateur
            }
        })
        return {message:"", status:201, participant:participant}
    } catch (error) {
        console.error(error)
        return {message:"Erreur serveur", status:500, participant:null}
    }
}
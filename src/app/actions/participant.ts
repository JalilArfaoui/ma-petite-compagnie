"use server";

import { prisma } from "@/lib/prisma";

export async function ajouterUnParticipant(idEvenement: number, idUtilisateur: number) {
  try {
    if (!idEvenement || !idUtilisateur) {
      return { message: "Des informations sont manquantes", status: 400, participant: null };
    }
    const participant = await prisma.participantsEvenement.create({
      data: {
        evenementId: idEvenement,
        utilisateurId: idUtilisateur,
      },
    });
    return { message: "", status: 201, participant: participant };
  } catch (error) {
    console.error(error);
    return { message: "Erreur serveur", status: 500, participant: null };
  }
}

export async function ajouterPlusieursParticipants(participants:{evenementId:number, utilisateurId: number}[]) {
    try {
        if (!participants) {
            return { message: "Des informations sont manquantes", status: 400, participants:null}
        }
        const participantsEvenement = await prisma.participantsEvenement.createMany({
            data: participants,
            skipDuplicates: true,
        })
        return {message:"", status:201, participants:participantsEvenement}
    } catch (error) {
        console.error(error)
        return {message:"Erreur serveur", status:500, participants:null}
    }
}
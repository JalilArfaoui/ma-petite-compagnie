"use server"

import { prisma } from "@/lib/prisma"

export async function chercherUtilisateurParNom(nom: string){
    try {
        const term = nom?nom:"";
        const utilisateurs = await prisma.utilisateurBouchon.findMany({
            where:{
                nom:{
                    contains:term,
                    mode:"insensitive"
                }
            }
        })
        return {message:"", status:201, utilisateurs:utilisateurs}
    } catch (error) {
        console.error(error);
        return {message:"Erreur serveur", status:500, utilisateurs:null}
    }
}
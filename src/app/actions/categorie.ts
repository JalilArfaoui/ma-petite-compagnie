"use server"

import { prisma } from "@/lib/prisma"

export async function creerCategorie(datas: FormData) {
    const nom = datas.get("nom") as string;
    const couleur = datas.get("couleur") as string;
    const compagnieId = 1 // TODO récupérer la compagnie de l'utilisateur
    try {
        if (!nom ||  !couleur || !compagnieId) {
            return { message: "Des informations sont manquantes, la catégorie ne peut pas être crée.", status: 400, categorie:null}
        }
        const categorie = await prisma.categorie.create({
            data:{
                nom,
                couleur,
                compagnie:{connect: {id: compagnieId}}
            }
        })

        return { message: "", status: 201, categorie:categorie}
    } catch (error) {
        console.error(error)
        return {message: "Erreur serveur" ,status: 500, categorie:null}
    }
}
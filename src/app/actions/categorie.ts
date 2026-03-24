"use server"

import { prisma } from "@/lib/prisma"
import {NextResponse} from "next/server";

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

export async function getCategories() {
    try{
        const idCompagnie = 1;
        if (!idCompagnie) {
            return { message: "L'id de la compagnie n'est pas récupéré", status: 400,
            categories:null};
        }
        const categories = await  prisma.categorie.findMany({
            where:{
                idCompagnie:idCompagnie
            }
        })
        return {categories:categories,message:"",  status: 200 };
    } catch (error) {
        console.error(error);
        return {categories:null, message: "Erreur serveur:" + error, status: 500 };
    }
}
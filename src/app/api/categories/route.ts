import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

type CreateCategorieBody = {
    nom: string;
    idCompagnie: number;
}
export async function POST(req: NextRequest){
    try{
        const body: CreateCategorieBody = await req.json();
        const { nom, idCompagnie } = body;
        if (!nom || !idCompagnie) {
            return NextResponse.json({message: "Des informations sont manquantes"}, {status: 400});
        }
        const categorie = await prisma.categorie.create({
            data:{
                nom,
                idCompagnie
            }
        });
        return NextResponse.json(categorie, {status:201})
    } catch (error) {   
        console.error(error);
        return NextResponse.json({message:"Erreur serveur:" + error}, {status:500});
    }
}

export async function GET(req:NextRequest){
    try{
        const { searchParams } = new URL(req.url);
        const idCompagnie = Number(searchParams.get("idCompagnie"));
        if (!idCompagnie) {
            return NextResponse.json({ message: "L'id de la compagnie n'est pas récupéré" }, { status: 400 });
        }
        const lieux = await  prisma.categorie.findMany({
            where:{
                idCompagnie:idCompagnie
            }
        })
        return NextResponse.json(lieux, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Erreur serveur:" + error }, { status: 500 });
    }
}
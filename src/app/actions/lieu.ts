import { prisma } from "@/lib/prisma";

export async function creerLieu(datas: FormData) {
  const libelle = datas.get("libelle") as string;
  const adresse = datas.get("adresse") as string;
  const ville = datas.get("ville") as string;
  const numero_salle = datas.get("numero_salle") as string | null;
  const idCompagnie = 1;

  try {
    if (!libelle || !adresse || !ville || !idCompagnie) {
      return { message: "Des informations sont manquantes.", status: 400, lieu: null };
    }
    const lieu = await prisma.lieu.create({
      data: {
        libelle,
        adresse,
        ville,
        numero_salle,
        idCompagnie,
      },
    });
    return { message: "", status: 201, lieu: lieu };
  } catch (error) {
    console.error(error);
    return { message: "Erreur serveur:" + error, status: 500, lieu: null };
  }
}

export async function getLieux() {
  try {
    const idCompagnie = 1;
    if (!idCompagnie) {
      return { message: "L'id de la compagnie n'est pas récupéré", status: 400, lieux: null };
    }
    const lieux = await prisma.lieu.findMany({
      where: {
        idCompagnie: idCompagnie,
      },
    });
    return { message: "", status: 200, lieux: lieux };
  } catch (error) {
    console.error(error);
    return { lieux: null, message: "Erreur serveur:" + error, status: 500 };
  }
}

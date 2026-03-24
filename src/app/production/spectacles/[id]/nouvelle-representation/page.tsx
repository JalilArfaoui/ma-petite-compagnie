import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@/components/ui";
import { StatutSpectacle, TypeSpectacle } from "@prisma/client";

export const dynamic = "force-dynamic";

async function reserver(formData: FormData) {
  "use server";

  const date = new Date(formData.get("date") as string);
  const spectacleId = Number(formData.get("spectacleId"));
  const lieuId = Number(formData.get("lieuId"));

  formData.forEach((data, key) => {});
  await prisma.representation.create({
    data: {},
  });

  await prisma.reservationObjet.create({
    data: {
      titre: titre,
      type: type,
      compagnieId: 1,
    },
  });

  revalidatePath("/production");
}

async function getObjets(formData: FormData) {
  "use server";

  laDate = new Date(formData.get("date") as string);

  revalidatePath("/production");
}

/* =========================
   HELPER FUNCTIONS
========================= */

const formatDateInput = (date: Date) => {
  return date.toISOString().slice(0, 16);
};

let laDate: Date | null = null;

export default async function ProductionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const compagnieId = 3;
  const spectacle = await prisma.spectacle.findFirst({
    where: {
      id: Number(id),
      compagnieId: compagnieId,
    },
  });

  if (spectacle == null) {
    return <p>vous n&apos;avez pas acces a ce spectacle</p>;
  } else {
    if (laDate == null) {
      return (
        <div id="main">
          <form action={getObjets}>
            <div>
              <label className="block font-semibold mb-2">Date et heure *</label>
              <input
                name="date"
                type="datetime-local"
                required
                className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
              />
            </div>

            <button
              type="submit"
              className="mt-6 px-6 py-3 bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] transition-colors"
            >
              confirmer cette date
            </button>
          </form>
        </div>
      );
    } else {
      const besoins = await prisma.besoinSpectacle.findMany({
        include: {
          typeObjet: {
            include: {
              objets: {
                where: {
                  etat: {
                    not: "CASSE",
                  },
                  reservations: {
                    some: {
                      representation: {
                        date: {
                          not: laDate,
                        },
                      },
                    },
                  },
                  compagnieId: compagnieId,
                },
              },
            },
          },
        },
        where: {
          spectacleId: spectacle.id,
        },
      });
      return (
        <div id="main">
          <form action={getObjets}>
            <div>
              <label className="block font-semibold mb-2">Date et heure *</label>
              <input
                name="date"
                type="datetime-local"
                defaultValue={formatDateInput(laDate)}
                required
                className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
              />
            </div>

            <button
              type="submit"
              className="mt-6 px-6 py-3 bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] transition-colors"
            >
              modifier la date
            </button>
          </form>
          <form action={getObjets}>
            <div>
              <label className="block font-semibold mb-2">Date et heure *</label>
              <input
                name="date"
                type="datetime-local"
                defaultValue={formatDateInput(laDate)}
                required
                className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
              />
            </div>

            {besoins.map((besoin) => (
              <Card
                key={besoin.id}
                className="p-6 shadow-md border-l-4 border-l-primary bg-white transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                {besoin.nb < besoin.typeObjet.objets.length ? <p></p> : <p></p>}
              </Card>
            ))}

            <button
              type="submit"
              className="mt-6 px-6 py-3 bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] transition-colors"
            >
              enregistrer la representation
            </button>
          </form>
        </div>
      );
    }
  }
}

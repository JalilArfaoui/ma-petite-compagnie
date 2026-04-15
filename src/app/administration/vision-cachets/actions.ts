"use server";

import { prisma } from "@/lib/prisma";

export async function getCachets() {
  return await prisma.cachet.findMany({
    include: {
      spectacle: true,
      membre: {
        include: {
          user: true,
        },
      },
    },
  });
}

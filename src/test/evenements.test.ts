import { describe, it, expect, vi } from "vitest"
import { POST } from "@/app/api/evenements/route"
import { NextRequest } from "next/server"
import {prisma} from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
    prisma:{
        evenement:{
            create:vi.fn()
        }
    }
}));

describe("POST /api/evenements", () => {
    it("crée un évènement et retourne 201", async () => {
        const mockedCreate = vi.mocked(prisma.evenement.create);
        mockedCreate.mockResolvedValue({
            id:1,
            nom:"Répétion de la troupe 5",
            compagnieId:1,
            lieuId:1,
            categorieId:1,
            dateDebut:new Date(2024,10,5,10),
            dateFin:new Date(2024,10,5,11,15)
        })

        const req = new NextRequest("http://localhost/api/evenements", {
            method: "POST",
            body: JSON.stringify({
                nom:"Répétion de la troupe 5",
                compagnieId:1,
                lieuId:1,
                categorieId:1,
                dateDebut:new Date(2024,10,5,10),
                dateFin:new Date(2024,10,5,11,15)
            }),
        });
        const res = await POST(req);
        expect(res.status).toBe(201)
        const json = await res.json();
        expect(json.nom).toBe("Répétion de la troupe 5");
    })
})
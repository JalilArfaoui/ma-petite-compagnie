import { describe, it, expect, vi } from "vitest"
import { POST } from "@/app/api/lieux/route"
import { NextRequest } from "next/server"
import {prisma} from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
    prisma:{
        lieu:{
            create:vi.fn(),
        },
    }
}))

describe("POST /api/lieux", () =>{
    it("crée un lieu et retourne 201", async () => {
        const mockedCreate = vi.mocked(prisma.lieu.create);
        mockedCreate.mockResolvedValue({
            id:1,
            libelle:"Théâtre du nord",
            adresse:"14 avenue le grand",
            ville:"Toulouse",
            numero_salle:null,
            idCompagnie:1,
        });
        const req = new NextRequest("http://localhost/api/lieux", {
            method: "POST",
            body: JSON.stringify({
                libelle:"Théâtre du nord",
                adresse:"14 avenue le grand",
                ville:"Toulouse",
                numero_salle:null,
                idCompagnie:1,
            }),
        });

        const res = await POST(req);
        expect(res.status).toBe(201)
        const json = await res.json();
        expect(json.libelle).toBe("Théâtre du nord")
    })
})
import { describe, it, expect, vi } from "vitest";
import {prisma} from "@/lib/prisma";
import {NextRequest} from "next/server";
import {POST} from "@/app/api/categories/route";
vi.mock("@/lib/prisma", () => ({
    prisma:{
        categorie:{
            create: vi.fn()
        }
    }
}))

describe("POST /api/categories", () => {
    it("crée une catégorie et retourne 201", async () => {
        const mockedCreate = vi.mocked(prisma.categorie.create);
        const nom = "Répétition";
        const couleur = "#F7A400";
        mockedCreate.mockResolvedValue({
            id:1,
            nom:nom,
            couleur:couleur,
            idCompagnie:1
        });
        const req = new NextRequest("http://localhost/api/categories", {
            method: "POST",
            body:JSON.stringify({
                nom:nom,
                couleur:couleur,
                idCompagnie:1
            })
        });
        const res = await POST(req);
        expect(res.status).toBe(201);
        const json = await res.json();
        expect(json.nom).toBe(nom);
    })
})
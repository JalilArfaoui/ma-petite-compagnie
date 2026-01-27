import { describe, it, expect, vi } from "vitest"
import { POST } from "@/app/api/compagnies/route"
import { NextRequest } from "next/server"
import {prisma} from "@/lib/prisma";

/**
 * On Mock les dépendances et les comportements de prisma.
 */
vi.mock("@/lib/prisma", () => ({
    prisma: {
        $transaction: vi.fn(),
        compagnie: {
            create: vi.fn(),
        },
        utilisateurBouchon: {
            update:vi.fn(),
            findUnique:vi.fn(),
        }
    },
}));

/**
 * On crée une compagnie. On vérifie que l'utilisateur qui crée une compagnie
 * existe. On vérifie qu'il est ajouté à la compagnie et que ses droits de
 * modification sont activé.
 */
describe("POST /api/compagnies", () => {
    it("crée une compagnie et retourne 201", async () => {
        const mockedTransaction = vi.mocked(prisma.$transaction);
        const mockedFindUser = vi.mocked(prisma.utilisateurBouchon.findUnique);
        const mockedCreate = vi.mocked(prisma.compagnie.create);
        const mockedUpdate = vi.mocked(prisma.utilisateurBouchon.update);

        mockedTransaction.mockImplementation(async (cb) => {
            return cb(prisma)
        });

        mockedFindUser.mockResolvedValue({
            id: 1,
            compagnieId: null,
            droitModificationPlanification: false,
        });

        mockedCreate.mockResolvedValue({
            id: 1,
            nom: "Ma compagnie",
        });
        mockedUpdate.mockResolvedValue({
            id: 1,
            compagnieId: null,
            droitModificationPlanification: true,
        });

        const req = new NextRequest("http://localhost/api/compagnies", {
            method: "POST",
            body: JSON.stringify({
                nom: "Ma compagnie",
                utilisateurId: 1,
            }),
        });

        const res = await POST(req);
        expect(res.status).toBe(201)

        expect(mockedFindUser).toHaveBeenCalledWith({
            where: { id: 1 },
        });

        expect(mockedCreate).toHaveBeenCalledWith({
            data: {
                nom: "Ma compagnie",
            },
        });
        expect(mockedUpdate).toHaveBeenCalledWith({
            where: { id: 1 },
            data: {
                droitModificationPlanification: true,
                compagnieId: 1,
            },
        });

        const json = await res.json();
        expect(json.compagnie.nom).toBe("Ma compagnie");
        expect(prisma.compagnie.create).toHaveBeenCalledOnce();
    })
})
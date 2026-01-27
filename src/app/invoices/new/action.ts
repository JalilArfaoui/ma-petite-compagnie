// app/invoices/new/actions.ts
"use server"

import { prisma } from "@/lib/prisma"
import { invoiceFormSchema } from "./schema"
import { redirect } from "next/navigation"

export async function createInvoice(rawData: unknown) {
  // 1️⃣ Validation (sécurité absolue)
  const data = invoiceFormSchema.parse(rawData)

  // 2️⃣ Récupération de l’entreprise (exemple simple)
  // 👉 ici tu peux adapter si tu as un user / troupe / auth
  const company = await prisma.company.findFirst()

  if (!company) {
    throw new Error("Entreprise introuvable")
  }

  // 3️⃣ Calcul des lignes + total HT
  const linesWithTotals = data.lines.map((line) => {
    const sign = line.type === "DISCOUNT" ? -1 : 1
    const total = sign * line.quantity * line.unitPrice

    return {
      ...line,
      total,
    }
  })

  const totalHT = linesWithTotals.reduce(
    (sum, line) => sum + line.total,
    0
  )

  // 4️⃣ Transaction (numéro + facture)
  const invoice = await prisma.$transaction(async (tx: any) => {
    // 🔢 Génération du numéro sans trou
    const counter = await tx.invoiceCounter.update({
      where: { id: 1 },
      data: { last: { increment: 1 } },
    })

    const invoiceNumber = counter.last

    // 🧾 Création facture
    return tx.invoice.create({
      data: {
        number: invoiceNumber,
        issueDate: new Date(data.issueDate),
        dueDate: new Date(data.dueDate),

        billingLocation:
          data.billingLocation ?? company.location ?? null,

        companyName: company.name,
        companyAddress: company.address,
        companyWebsite: data.showWebsite
          ? company.website
          : null,
        rib: company.rib,

        totalHT,

        companyId: company.id,

        lines: {
          create: linesWithTotals.map((line) => ({
            label: line.label,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            total: line.total,
            type: line.type,
          })),
        },
      },
    })
  })

  // 5️⃣ Redirection vers la facture
  redirect(`/invoices/${invoice.id}`)
}

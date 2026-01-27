// schema.ts
import { z } from "zod"

export const invoiceLineSchema = z.object({
  label: z.string().min(1),
  quantity: z.number().min(1),
  unitPrice: z.number(),
  type: z.enum(["SERVICE", "EXTRA_FEE", "DISCOUNT"]),
})

export const invoiceFormSchema = z.object({
  issueDate: z.string(),
  dueDate: z.string(),

  billingLocation: z.string().optional(),

  showWebsite: z.boolean(),

  lines: z.array(invoiceLineSchema).min(1),
})

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>

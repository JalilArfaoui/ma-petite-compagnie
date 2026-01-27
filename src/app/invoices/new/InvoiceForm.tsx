"use client"

import {
  Box,
  Button,
  Checkbox,
  Input,
  Stack,
  Text,
  Select,
} from "@/components/ui"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { invoiceFormSchema, InvoiceFormValues } from "./schema"
import { createInvoice } from "./actions"
import InvoicePreview from "./InvoicePreview"

export default function InvoiceForm({
  company,
}: {
  company: {
    name: string
    address: string
    website?: string
    rib: string
    location?: string
  }
}) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      issueDate: new Date().toISOString().slice(0, 10),
      showWebsite: !!company.website,
      lines: [
        {
          label: "",
          quantity: 1,
          unitPrice: 0,
          type: "SERVICE",
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lines",
  })

  const values = watch()

  return (
    <Flex gap={6}>
      {/* FORMULAIRE */}
      <Box w="50%">
        <form onSubmit={handleSubmit(createInvoice)}>
          <Stack Spacing>
            <Input type="date" {...register("issueDate")} />
            <Input type="date" {...register("dueDate")} />

            <Input
              placeholder="Lieu de facturation"
              {...register("billingLocation")}
            />

            <Text fontWeight="bold">Entreprise</Text>
            <Input value={company.name} disabled />
            <Input value={company.address} disabled />
            <Input value={company.rib} disabled />

            {company.website && (
              <Checkbox {...register("showWebsite")}>
                Afficher le site web sur la facture
              </Checkbox>
            )}

            <Text fontWeight="bold">Prestations</Text>

            {fields.map((field, index) => (
              <Flex key={field.id} gap={2}>
                <Input
                  placeholder="Description"
                  {...register(`lines.${index}.label`)}
                />
                <Input
                  type="number"
                  {...register(`lines.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                />
                <Input
                  type="number"
                  {...register(`lines.${index}.unitPrice`, {
                    valueAsNumber: true,
                  })}
                />
                <Select {...register(`lines.${index}.type`)}>
                  <option value="SERVICE">Prestation</option>
                  <option value="EXTRA_FEE">Frais</option>
                  <option value="DISCOUNT">Remise</option>
                </Select>
                <Button onClick={() => remove(index)}>✕</Button>
              </Flex>
            ))}

            <Button
              onClick={() =>
                append({
                  label: "",
                  quantity: 1,
                  unitPrice: 0,
                  type: "SERVICE",
                })
              }
            >
              Ajouter une ligne
            </Button>

            <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
              Créer la facture
            </Button>
          </Stack>
        </form>
      </Box>

      {/* PREVIEW */}
      <Box w="50%" bg="gray.50" p={4}>
        <InvoicePreview values={values} company={company} />
      </Box>
    </Flex>
  )
}

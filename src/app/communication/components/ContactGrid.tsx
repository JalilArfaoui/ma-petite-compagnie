import { Button, Table } from "@/components/ui";
import { Contact } from "@prisma/client";
import Link from "next/link";

export function ContactGrid({
  contact,
  onSelect,
  onDelete,
  className = "",
  index,
}: {
  contact: Contact;
  onSelect: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  className: string;
  index: number;
}) {
  return (
    <Table.Row onClick={() => onSelect(contact)} className={"active:bg-gray-100 " + className}>
      <Table.Cell>{contact.nom}</Table.Cell>
      <Table.Cell>{contact.prenom}</Table.Cell>
      <Table.Cell>{contact.email}</Table.Cell>
      <Table.Cell>{contact.tel}</Table.Cell>
      <Table.Cell>
        <Button onClick={() => onDelete(contact)} variant={"destructive"} size={"sm"}>
          Supprimer
        </Button>
      </Table.Cell>
      <Table.Cell>
        <Link href={"/communication/" + contact.id}>
          <Button size={"sm"} variant={"outline"}>
            Modifier
          </Button>
        </Link>
      </Table.Cell>
    </Table.Row>
  );
}

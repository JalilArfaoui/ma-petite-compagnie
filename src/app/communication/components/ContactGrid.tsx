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
      <Table.Cell className="text-[8px] md:text-[12px] lg:text-[1rem]">{contact.nom}</Table.Cell>
      <Table.Cell className="text-[8px] md:text-[12px] lg:text-[1rem]">{contact.prenom}</Table.Cell>
      <Table.Cell className="text-[8px] md:text-[12px] lg:text-[1rem] max-w-[10rem] text-pretty break-words break-all">
        {contact.email}
      </Table.Cell>
      <Table.Cell className="text-[8px] md:text-[12px] lg:text-[1rem]">{contact.tel}</Table.Cell>
      <Table.Cell className="text-[8px] md:text-[12px] lg:text-[1rem]">{contact.ville}</Table.Cell>
      <Table.Cell className="max-w-[19rem] text-[8px] md:text-[12px] lg:text-[1rem] text-pretty break-words break-all">
        {contact.lieu}
      </Table.Cell>
      <Table.Cell className="max-w-[10rem] text-[8px] md:text-[12px] lg:text-[1rem] text-pretty break-words break-all">
        {contact.notes}
      </Table.Cell>
      <Table.Cell>
        <Button
          className="text-[8px] p-1 md:text-[12px] lg:text-[1rem]"
          onClick={() => onDelete(contact)}
          variant={"destructive"}
          size={"sm"}
        >
          Supprimer
        </Button>
      </Table.Cell>
      <Table.Cell>
        <Link href={"/communication/" + contact.id}>
          <Button
            className="text-[8px] md:text-[12px] lg:text-[1rem] p-1"
            size={"sm"}
            variant={"outline"}
          >
            Modifier
          </Button>
        </Link>
      </Table.Cell>
    </Table.Row>
  );
}

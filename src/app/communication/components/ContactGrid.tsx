import { Button, Stack, Table } from "@/components/ui";
import Link from "next/link";
import { ContactWithListes } from "../api/contact/contact";
import { ListeContact } from "@prisma/client";

export function ContactGrid({
  contact,
  onSelect,
  onDelete,
  onListeElementDeleted,
  className = "",
}: {
  contact: ContactWithListes;
  onSelect: (contact: ContactWithListes) => void;
  onDelete: (contact: ContactWithListes) => void;
  onListeElementDeleted: (contact: ContactWithListes, listeId: number) => void;
  className: string;
}) {
  function afficherListe(listes: ListeContact[]) {
    return listes.map((liste) => {
      return (
        <div className="m-1 bg-primary text-white text-center rounded-xl" key={liste.id}>
          <Stack direction="row" justify="start" className="items-center w-30">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onListeElementDeleted(contact, liste.id);
              }}
              size="icon"
              className="h-5"
            >
              X
            </Button>

            <Stack
              direction="row"
              justify="center"
              className="w-full text-pretty wrap-break-word break-all p-1"
            >
              {liste.nom}
            </Stack>
          </Stack>
        </div>
      );
    });
  }

  return (
    <Table.Row onClick={() => onSelect(contact)} className={"active:bg-gray-100 " + className}>
      <Table.Cell className=" max-w-40 text-[8px] md:text-[12px] lg:text-[1rem] text-pretty wrap-break-word break-all">
        {contact.nom}
      </Table.Cell>
      <Table.Cell className=" max-w-40  text-[8px] md:text-[12px] lg:text-[1rem] text-pretty wrap-break-word break-all">
        {contact.prenom}
      </Table.Cell>
      <Table.Cell className="text-[8px] md:text-[12px] lg:text-[1rem]  max-w-70 text-pretty wrap-break-word break-all">
        {contact.email}
      </Table.Cell>
      <Table.Cell className="text-[8px] md:text-[12px] lg:text-[1rem]">{contact.tel}</Table.Cell>
      <Table.Cell className="text-[8px] md:text-[12px] lg:text-[1rem]">
        {afficherListe(contact.listeContacts)}
      </Table.Cell>
      <Table.Cell className="text-[8px] md:text-[12px] lg:text-[1rem]">{contact.ville}</Table.Cell>
      <Table.Cell className="max-w-76 text-[8px] md:text-[12px] lg:text-[1rem] text-pretty wrap-break-word break-all">
        {contact.lieu}
      </Table.Cell>
      <Table.Cell className=" max-w-40 text-[8px] md:text-[12px] lg:text-[1rem] text-pretty wrap-break-word break-all">
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

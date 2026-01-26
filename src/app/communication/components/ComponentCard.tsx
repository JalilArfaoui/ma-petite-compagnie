import { Contact } from "@prisma/client";
export function ComponentCard({ contact }: { contact: Contact }) {
  return (
    <>
      <div>
        <h4>
          {contact.nom} {contact.prenom}
        </h4>
        <section>
          <h4>Email</h4>
          <summary>{contact.email}</summary>
        </section>
        <section>
          <h4>Téléphone</h4>
          <summary>{contact.tel}</summary>
        </section>
        <section>
          <h4>Rôle</h4>
          <summary>{contact.role}</summary>
        </section>
        <div>{contact.date_creation.toDateString()}</div>
      </div>
    </>
  );
}

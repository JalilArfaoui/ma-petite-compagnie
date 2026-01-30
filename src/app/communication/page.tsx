import { ObtenirBeaucoupContact } from "./api/contact";
import { ContactCard } from "./components/ContactCard";

export default async function Contact() {
  let contacts = (await ObtenirBeaucoupContact()).contact;
  if (!contacts) {
    contacts = [];
  }
  return (
    <main>
      <h1>Page de contact</h1>
      {contacts.map((contact) => {
        return <ContactCard key={contact.id} contact={contact}></ContactCard>;
      })}
    </main>
  );
}

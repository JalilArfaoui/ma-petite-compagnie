import { getMany } from "./api/contact";
import { ComponentCard } from "./components/ComponentCard";

export default async function Contact() {
  let contacts = (await getMany()).contact;
  if (!contacts) {
    contacts = [];
  }
  return (
    <main>
      <h1>Page de contact</h1>
      <ComponentCard contact={contacts[0]}></ComponentCard>
      {contacts.map((contact) => {
        return <ComponentCard key={contact.id} contact={contact}></ComponentCard>;
      })}
    </main>
  );
}

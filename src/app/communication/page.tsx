import { createContact, getMany } from "./util/contact";

export default async function Contact() {
  createContact("Mec", "Prenom");
  await getMany();
  return (
    <main>
      <h1>Page de contact</h1>
    </main>
  );
}

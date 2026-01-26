import { getMany } from "./api/contact";

export default async function Contact() {
  await getMany();
  return (
    <main>
      <h1>Page de contact</h1>
    </main>
  );
}

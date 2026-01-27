import { strict } from "assert";
import { ChangeEvent, FormEvent, useState } from "react";

interface FormulaireEmail {
  destinataire : string;
  sujet: string ;
  message: string;
}

 export default function EnvoieCouriel() {
  const [formulaire, setFormulaire] = useState<FormulaireEmail>({
    destinataire: "",
    sujet: "",
    message: "",
  });

  const gererChangement = (
    e: ChangeEvent<HTMLInputElement| HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormulaire({
      ...formulaire,
      [name]: value,
    });
  };

  const gererEnvoi = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formulaire);
  };

return (
    <form onSubmit={gererEnvoi}>
      <input
        type="email"
        name="destinataire"
        placeholder="Destinataire"
        value={formulaire.destinataire}
        onChange={gererChangement}
        required
      />

      <input
        type="text"
        name="sujet"
        placeholder="Sujet"
        value={formulaire.sujet}
        onChange={gererChangement}
        required
      />

      <textarea
        name="message"
        placeholder="Message"
        value={formulaire.message}
        onChange={gererChangement}
        required
      />

      <button type="submit">Envoyer</button>
    </form>
  );
}
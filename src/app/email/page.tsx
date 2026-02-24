"use client";

import { useState, ChangeEvent, FormEvent, JSX } from "react";

interface FormulaireEmail {
  destinataire: string;
  sujet: string;
  message: string;
}

export default function EnvoyerEmail(): JSX.Element {
  const [formulaire, setFormulaire] = useState<FormulaireEmail>({
    destinataire: "",
    sujet: "",
    message: "",
  });

  const [chargement, setChargement] = useState<boolean>(false);
  const [messageStatut, setMessageStatut] = useState<string | null>(null);

  const gererChangement = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormulaire((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const gererEnvoi = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setChargement(true);
    setMessageStatut(null);

    try {
      const reponse = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formulaire),
      });

      const data: { succes?: boolean; erreur?: string } =
        await reponse.json();

      if (!reponse.ok) {
        throw new Error(data.erreur);
      }

      setMessageStatut(" Email envoyé avec succès");
      setFormulaire({ destinataire: "", sujet: "", message: "" });
    } catch {
      setMessageStatut(" Erreur lors de l’envoi de l’email");
    } finally {
      setChargement(false);
    }
  };

  return (
    <main style={{ maxWidth: 500, margin: "100px auto" }}>
      <h1>Envoyer un email</h1>

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

        <button type="submit" disabled={chargement}>
          {chargement ? "Envoi..." : "Envoyer"}
        </button>
      </form>

      {messageStatut && <p>{messageStatut}</p>}
    </main>
  );
}

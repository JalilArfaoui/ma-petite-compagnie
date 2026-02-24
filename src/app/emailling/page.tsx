"use client";

import { useState, ChangeEvent, FormEvent, JSX } from "react";

// Types
interface Contact {
  id: number;
  nom: string;
  email: string;
  tags: string[];
}

interface EmailForm {
  destinataire: string;
  sujet: string;
  message: string;
}

interface HistoriqueEmail {
  destinataire: string;
  sujet: string;
  date: string;
  statut: "succès" | "erreur";
}

export default function PageEmailing(): JSX.Element {
  //  Base de contacts simulée 
  const contacts: Contact[] = [
    { id: 1, nom: "Alice", email: "alice@example.com", tags: ["acteur"] },
    { id: 2, nom: "Bob", email: "bob@example.com", tags: ["bénévole"] },
    { id: 3, nom: "Charlie", email: "charlie@example.com", tags: ["administrateur"] },
    { id: 4, nom: "Diane", email: "diane@example.com", tags: ["acteur", "administrateur"] },
  ];

  //  États 
  const [filtreTag, setFiltreTag] = useState<string>("");
  const [formulaire, setFormulaire] = useState<EmailForm>({
    destinataire: "",
    sujet: "",
    message: "",
  });
  const [chargement, setChargement] = useState<boolean>(false);
  const [messageStatut, setMessageStatut] = useState<string | null>(null);
  const [historique, setHistorique] = useState<HistoriqueEmail[]>([]);

  //  Gestion du formulaire 
  const gererChangement = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormulaire(prev => ({ ...prev, [name]: value }));
  };

  //  Envoi email 
  const gererEnvoi = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChargement(true);
    setMessageStatut(null);

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulaire),
      });

      const data = await res.json();

      const nouvelHistorique: HistoriqueEmail = {
        destinataire: formulaire.destinataire,
        sujet: formulaire.sujet,
        date: new Date().toLocaleString(),
        statut: res.ok ? "succès" : "erreur",
      };

      setHistorique(prev => [nouvelHistorique, ...prev]);

      if (!res.ok) throw new Error(data.erreur);

      setMessageStatut(" Email envoyé avec succès !");
      setFormulaire({ destinataire: "", sujet: "", message: "" });
    } catch {
      setMessageStatut("Erreur lors de l’envoi de l’email");
    } finally {
      setChargement(false);
    }
  };

  //  Relancer dernier email 
  const relancerDernierEmail = () => {
    if (!historique[0]) return;
    setFormulaire({
      destinataire: historique[0].destinataire,
      sujet: "Relance : " + historique[0].sujet,
      message: formulaire.message,
    });
  };

  return (
    <main style={{ maxWidth: 600, margin: "50px auto" }}>
      <h1>Emailing – Ma Petite Compagnie</h1>

      {/* Filtre par tag */}
      <label>
        Filtrer par tag :
        <select value={filtreTag} onChange={e => setFiltreTag(e.target.value)}>
          <option value="">Tous</option>
          <option value="acteur">Acteurs</option>
          <option value="bénévole">Bénévoles</option>
          <option value="administrateur">Administrateurs</option>
        </select>
      </label>

      {/* Formulaire d’envoi */}
      <form onSubmit={gererEnvoi} style={{ marginTop: 20 }}>
        <label>
          Destinataire :
          <select
            name="destinataire"
            value={formulaire.destinataire}
            onChange={gererChangement}
            required
          >
            <option value="">Sélectionner un contact</option>
            {contacts
              .filter(c => !filtreTag || c.tags.includes(filtreTag))
              .map(c => (
                <option key={c.id} value={c.email}>
                  {c.nom} ({c.tags.join(", ")})
                </option>
              ))}
          </select>
        </label>

        <label>
          Sujet :
          <input
            type="text"
            name="sujet"
            value={formulaire.sujet}
            onChange={gererChangement}
            required
          />
        </label>

        <label>
          Message :
          <textarea
            name="message"
            value={formulaire.message}
            onChange={gererChangement}
            rows={6}
            required
          />
        </label>

        <button type="submit" disabled={chargement}>
          {chargement ? "Envoi en cours..." : "Envoyer l’email"}
        </button>
      </form>

      {/* Relance */}
      {historique.length > 0 && (
        <button onClick={relancerDernierEmail} style={{ marginTop: 10 }}>
          Relancer dernier email
        </button>
      )}

      {/* Message de statut */}
      {messageStatut && <p style={{ marginTop: 10 }}>{messageStatut}</p>}

      {/* Historique */}
      <h2 style={{ marginTop: 30 }}>Historique des emails</h2>
      <ul>
        {historique.map((h, idx) => (
          <li key={idx}>
            [{h.date}] {h.destinataire} — {h.sujet} — {h.statut}
          </li>
        ))}
      </ul>
    </main>
  );
}

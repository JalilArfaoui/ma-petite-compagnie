"use client";

import { useState, ChangeEvent, FormEvent, JSX } from "react";

interface EmailForm {
  destinataire: string;
  sujet: string;
  message: string;
}

export default function PageEmailing(): JSX.Element {
  const [form, setForm] = useState<EmailForm>({
    destinataire: "",
    sujet: "",
    message: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: { succes?: boolean; erreur?: string } = await res.json();

      if (!res.ok) throw new Error(data.erreur);

      setFeedback(" Email envoyé avec succès");
      setForm({ destinataire: "", sujet: "", message: "" });
    } catch {
      setFeedback("Erreur lors de l’envoi de l’email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 600, margin: "50px auto" }}>
      <h1> Page d’emailing</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Destinataire
          <input
            type="email"
            name="destinataire"
            value={form.destinataire}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Sujet
          <input
            type="text"
            name="sujet"
            value={form.sujet}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Message
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={6}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Envoi en cours..." : "Envoyer l’email"}
        </button>
      </form>

      {feedback && <p>{feedback}</p>}
    </main>
  );
}


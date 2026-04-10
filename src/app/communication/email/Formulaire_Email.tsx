"use client";

import { useState, FormEvent } from "react";
import { Box, Input, Stack, Button } from "@/components/ui";
import { Filtre_Email } from "./Filtre_Email";
import { envoyer_Email } from "./Action/EnvoieEmail";

export function Formulaire_Email() {
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");
  const [filtres, setFiltres] = useState({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    await envoyer_Email({
      sujet,
      message,
      filtres,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Box>
          Sujet :
          <Input
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
          />
        </Box>

        <Box>
          Message :
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Box>

        <Filtre_Email setFiltres={setFiltres} />

        <Button type="submit">Envoyer</Button>
      </Stack>
    </form>
  );
}
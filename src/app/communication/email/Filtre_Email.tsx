"use client";

import { Box, Input, Stack } from "@/components/ui";

export function Filtre_Email({
  set_Ville,
  set_Role,
  set_Nom,
  set_Prenom,
}: {
  set_Ville: (v: string) => void;
  set_Role: (v: string) => void;
  set_Nom: (v: string) => void;
  set_Prenom: (v: string) => void;
}) {
  return (
    <Box>
      <Stack>

        <Box>
          Ville :
          <Input onChange={(e) => set_Ville(e.target.value)} />
        </Box>

        <Box>
          Role :
          <Input onChange={(e) => set_Role(e.target.value)} />
        </Box>

        <Box>
          Nom :
          <Input onChange={(e) => set_Nom(e.target.value)} />
        </Box>

        <Box>
          Prenom :
          <Input onChange={(e) => set_Prenom(e.target.value)} />
        </Box>

      </Stack>
    </Box>
  );
}
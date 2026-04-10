"use client";

import { Box, Input, Stack } from "@/components/ui";

export function Filtre_Email({
  setFiltres,
}: {
  setFiltres: (filtres: any) => void;
}) {
  function handleChange(e: any) {
    setFiltres((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <Box>
      <Stack>
        <Box>
          Age min :
          <Input name="age_min" onChange={handleChange} />
        </Box>

        <Box>
          Age max :
          <Input name="age_max" onChange={handleChange} />
        </Box>

        <Box>
          Ville :
          <Input name="ville" onChange={handleChange} />
        </Box>

        <Box>
          Role :
          <Input name="role" onChange={handleChange} />
        </Box>
      </Stack>
    </Box>
  );
}
"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export function Provider(props: ColorModeProviderProps) {
  return (
    <ColorModeProvider {...props}>
      <ChakraProvider value={defaultSystem}>{props.children}</ChakraProvider>
    </ColorModeProvider>
  );
}

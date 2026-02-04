"use client";

import { List as ChakraList } from "@chakra-ui/react";
import styled from "styled-components";

export const StyledListRoot = styled(ChakraList.Root)`
  font-family: Georgia, serif;
  color: #43566b;
  display: flex;
  flex-direction: column;
`;

export const StyledListItem = styled(ChakraList.Item)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  line-height: 1.6;
`;

export const StyledListIndicator = styled(ChakraList.Indicator)`
  color: #d00039;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  /* If it's a simple bullet point, we can enforce its look */
  &::before {
    content: "•";
    font-size: 1.5rem;
  }
`;

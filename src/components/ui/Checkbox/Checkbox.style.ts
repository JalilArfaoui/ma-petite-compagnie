"use client";

import { Checkbox as ChakraCheckbox } from "@chakra-ui/react";
import styled from "styled-components";

export const StyledCheckboxRoot = styled(ChakraCheckbox.Root)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-family: Georgia, serif;
`;

export const StyledCheckboxControl = styled(ChakraCheckbox.Control)`
  width: 1.25rem;
  height: 1.25rem;
  border: 1px solid #e1e8f1;
  border-radius: 6px;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #cbd5e1;
    background-color: #f8fafc;
  }

  &[data-state="checked"] {
    background-color: #d00039;
    border-color: #d00039;
    color: #ffffff;
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px rgba(208, 0, 57, 0.4);
  }
`;

export const StyledCheckboxLabel = styled(ChakraCheckbox.Label)`
  color: #43566b;
  font-size: 1rem;
  user-select: none;
`;

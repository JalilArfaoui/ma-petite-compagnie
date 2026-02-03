"use client";

import { Switch as ChakraSwitch } from "@chakra-ui/react";
import styled from "styled-components";

export const StyledSwitchRoot = styled(ChakraSwitch.Root)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-family: Georgia, serif;
`;

export const StyledSwitchControl = styled(ChakraSwitch.Control)`
  width: 2.5rem;
  height: 1.25rem;
  background-color: #e2e8f0;
  border-radius: 9999px;
  transition: all 0.2s ease-in-out;
  position: relative;
  padding: 2px;

  &[data-state="checked"] {
    background-color: #d00039;
  }
`;

export const StyledSwitchThumb = styled(ChakraSwitch.Thumb)`
  width: 1rem;
  height: 1rem;
  background-color: #ffffff;
  border-radius: 9999px;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  &[data-state="checked"] {
    transform: translateX(1px);
  }
`;

export const StyledSwitchLabel = styled(ChakraSwitch.Label)`
  color: #43566b;
  font-size: 1rem;
  user-select: none;
`;

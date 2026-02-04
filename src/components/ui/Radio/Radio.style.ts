"use client";

import { RadioGroup as ChakraRadioGroup } from "@chakra-ui/react";
import styled from "styled-components";

export const StyledRadioRoot = styled(ChakraRadioGroup.Root)`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-family: Georgia, serif;
`;

export const StyledRadioItem = styled(ChakraRadioGroup.Item)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
`;

export const StyledRadioControl = styled(ChakraRadioGroup.ItemControl)`
  width: 1.25rem;
  height: 1.25rem;
  border: 1px solid #e1e8f1;
  border-radius: 9999px;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    border-color: #cbd5e1;
    background-color: #f8fafc;
  }

  &[data-state="checked"] {
    border-color: #d00039;

    &::after {
      content: "";
      width: 0.625rem;
      height: 0.625rem;
      background-color: #d00039;
      border-radius: 9999px;
    }
  }
`;

export const StyledRadioText = styled(ChakraRadioGroup.ItemText)`
  color: #43566b;
  font-size: 1rem;
  user-select: none;
`;

"use client";

import { Textarea as ChakraTextarea } from "@chakra-ui/react";
import styled from "styled-components";

export const StyledTextarea = styled(ChakraTextarea)`
  width: 100%;
  font-family: Georgia, serif;
  color: #43566b;
  background-color: #ffffff;
  border: 1px solid #e1e8f1;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  transition: all 0.2s ease-in-out;
  font-size: 1rem;
  min-height: 120px;

  &::placeholder {
    color: #94a3b8;
  }

  &:hover {
    border-color: #cbd5e1;
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    border-color: #d00039;
    box-shadow: 0 0 0 1px #d00039;
    background-color: #ffffff;
  }

  &[data-invalid] {
    border-color: #e53e3e;
    box-shadow: 0 0 0 1px #e53e3e;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f1f5f9;
  }
`;

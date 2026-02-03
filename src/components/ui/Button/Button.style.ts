"use client";

import { Button, ButtonProps } from "@chakra-ui/react";
import styled, { css } from "styled-components";

export const StyledButton = styled(Button)<ButtonProps>`
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  color: #ffffff;
  background-color: #d00039;
  border-radius: 12px;
  font-family: Georgia;
  font-style: italic;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #c00039;
  }

  &:active {
    background-color: #960030ff;
  }

  ${(props) =>
    props.variant === "outline" &&
    css`
      color: #43566b;
      background-color: #ffffff;
      border: 1px solid #e1e8f1;
      font-style: normal;
      font-weight: normal;
      font-family: Georgia;
      &:hover {
        background-color: #eef2f7ff;
      }
      &:active {
        background-color: #e5e9eeff;
      }
    `}

  ${(props) =>
    props.size === "sm" &&
    css`
      padding-left: 1rem;
      padding-right: 1rem;
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
    `}

  ${(props) =>
    props.size === "md" &&
    css`
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      padding-top: 1rem;
      padding-bottom: 1rem;
    `}

  ${(props) =>
    props.size === "lg" &&
    css`
      padding-left: 2rem;
      padding-right: 2rem;
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
    `}

  ${(props) =>
    props.size === "xl" &&
    css`
      padding-left: 2.5rem;
      padding-right: 2.5rem;
      padding-top: 2rem;
      padding-bottom: 2rem;
    `}
`;

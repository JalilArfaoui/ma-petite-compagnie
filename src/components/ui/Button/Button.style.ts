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

  ${(props) =>
    props.variant === "outline" &&
    css`
      color: #000000;
      background-color: #ffffff;
      border: 1px solid #e1e8f1;
      font-style: normal;
      font-weight: normal;
    `}
`;

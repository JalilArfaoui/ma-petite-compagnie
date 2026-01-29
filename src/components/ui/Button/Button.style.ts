import { Button, ButtonProps } from "@chakra-ui/react";
import styled, { css } from "styled-components";

export const StyledButton = styled(Button)<ButtonProps>`
  width: 200px;
  height: 40px;
  color: #ffffff;
  background-color: #d00039;
  border-radius: 20px;
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

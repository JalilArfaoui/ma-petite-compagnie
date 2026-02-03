"use client";

import { Heading as ChakraHeading, Heading, HeadingProps } from "@chakra-ui/react";
import styled, { css } from "styled-components";

export const StyledHeading = styled(Heading)<HeadingProps>`
  color: #000000;
  font-family: Georgia;
  font-weight: bold;
  font-size: 110px;

  ${(props) =>
    props.as === "h2" &&
    css`
      color: #d00039;
      font-family: Georgia;
      font-weight: bold;
      font-style: italic;
    `}

  ${(props) =>
    props.as === "h3" &&
    css`
      color: #d00039;
      font-family: Georgia;
      font-weight: bold;
      font-style: italic;
      font-size: 36px;
    `}

    ${(props) =>
    props.as === "h4" &&
    css`
      font-family: Georgia;
      font-weight: bold;
      font-size: 24px;
    `}
`;

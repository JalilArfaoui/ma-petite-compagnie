"use client";

import { Link } from "@chakra-ui/react";
import styled from "styled-components";

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: #43566b;
  font-family: Georgia;
  &:hover {
    color: #d00039;
  }
  &:active {
    color: #5e0019ff;
  }
`;

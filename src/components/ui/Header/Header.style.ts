"use client";

import { Box, Heading, Link, Button } from "@chakra-ui/react";
import styled from "styled-components";

export const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 30px;
  padding-right: 30px;
  background-color: #fffbef;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

export const LogoSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const TicketLogo = styled(Box)`
  background-color: #ffe3e7;
  padding: 0.75rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c02626;
  transform: rotate(-7grad);
`;

export const LogoText = styled(Heading)`
  font-size: 22px;
  font-family: Georgia, serif;
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.5px;
  color: black;
`;

export const NavLink = styled(Link)`
  font-size: 18px;
  font-family: Georgia, serif;
  color: #4a5568;
  text-decoration: none;

  &:hover {
    color: #c02626;
    text-decoration: none;
  }
`;

export const CTAButton = styled(Button)`
  background-color: #c02626;
  color: white;
  border-radius: 12px;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  font-size: 18px;
  font-family: Georgia, serif;
  font-weight: bold;

  &:hover {
    background-color: #a02020;
  }
`;

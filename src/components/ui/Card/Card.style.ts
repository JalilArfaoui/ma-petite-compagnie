"use client";

import { CardRoot, CardTitle, CardBody, CardHeader } from "@chakra-ui/react";
import styled from "styled-components";

export const StyledCard = styled(CardRoot)`
  background-color: #f9fafc;
  border-radius: 20px;
  border: none;
  padding: 20px;
  gap: 20px;
`;

export type IconColor = "red" | "yellow" | "green" | "blue" | "orange";

const backgroundColorMap = {
  red: "#FFE3E7",
  yellow: "#FFF4C2",
  green: "#E9F8F2",
  blue: "#E9F2FD",
  orange: "#FFF5D9",
};

const iconColorMap = {
  red: "#c02626ff",
  yellow: "#eab308ff",
  green: "#16a34aff",
  blue: "#2563ebff",
  orange: "#ea580cff",
};

export const StyledCardHeader = styled(CardHeader)<{ $iconColor?: IconColor }>`
  width: fit-content;
  padding: 10px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.$iconColor ? backgroundColorMap[props.$iconColor] : backgroundColorMap.red};
  color: ${(props) => (props.$iconColor ? iconColorMap[props.$iconColor] : iconColorMap.red)};
`;

export const StyledCardBody = styled(CardBody)`
  gap: 20px;
`;

export const StyledCardTitle = styled(CardTitle)`
  font-size: 1.5rem;
  font-weight: bold;
  font-family: Georgia;
`;

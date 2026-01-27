import { CardRoot, CardTitle, CardBody } from "@chakra-ui/react";
import styled from "styled-components";

export const StyledCard = styled(CardRoot)`
  background-color: #f9fafc;
  border-radius: 20px;
  border: none;
  padding: 20px;
`;

export const StyledCardBody = styled(CardBody)`
  gap: 20px;
`;

export const StyledCardTitle = styled(CardTitle)`
  font-size: 1.5rem;
  font-weight: bold;
  font-family: georgian;
`;

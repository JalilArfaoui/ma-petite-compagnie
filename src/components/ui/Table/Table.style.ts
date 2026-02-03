"use client";

import { Table as ChakraTable } from "@chakra-ui/react";
import styled from "styled-components";

export const StyledTableRoot = styled(ChakraTable.Root)`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-family: Georgia, serif;
  color: #43566b;
  border: 1px solid #e1e8f1;
  border-radius: 12px;
  overflow: hidden;
`;

export const StyledTableHeader = styled(ChakraTable.Header)`
  background-color: #f8fafc;
`;

export const StyledTableRow = styled(ChakraTable.Row)`
  &:last-child td {
    border-bottom: 0;
  }

  &:hover {
    background-color: #f1f5f9;
  }
`;

export const StyledTableColumnHeader = styled(ChakraTable.ColumnHeader)`
  padding: 1rem;
  text-align: left;
  font-weight: bold;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e1e8f1;
  color: #64748b;
`;

export const StyledTableCell = styled(ChakraTable.Cell)`
  padding: 1rem;
  font-size: 1rem;
  border-bottom: 1px solid #e1e8f1;
`;

export const StyledTableBody = styled(ChakraTable.Body)`
  background-color: #ffffff;
`;

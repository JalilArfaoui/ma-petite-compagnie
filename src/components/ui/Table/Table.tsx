import { Table as ChakraTable } from "@chakra-ui/react";
import {
  StyledTableRoot,
  StyledTableBody,
  StyledTableRow,
  StyledTableHeader,
  StyledTableColumnHeader,
  StyledTableCell,
} from "./Table.style";

export const Table = StyledTableRoot as unknown as typeof ChakraTable.Root & {
  Container: typeof ChakraTable.ScrollArea;
  Head: typeof ChakraTable.Header;
  Body: typeof ChakraTable.Body;
  Foot: typeof ChakraTable.Footer;
  Row: typeof ChakraTable.Row;
  Header: typeof ChakraTable.ColumnHeader;
  Cell: typeof ChakraTable.Cell;
  Caption: typeof ChakraTable.Caption;
};

Table.Container = ChakraTable.ScrollArea;
Table.Head = StyledTableHeader;
Table.Body = StyledTableBody;
Table.Foot = ChakraTable.Footer;
Table.Row = StyledTableRow;
Table.Header = StyledTableColumnHeader;
Table.Cell = StyledTableCell;
Table.Caption = ChakraTable.Caption;

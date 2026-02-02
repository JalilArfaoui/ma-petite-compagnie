import { Table as ChakraTable } from '@chakra-ui/react';

export const Table = ChakraTable.Root as typeof ChakraTable.Root & {
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
Table.Head = ChakraTable.Header;
Table.Body = ChakraTable.Body;
Table.Foot = ChakraTable.Footer;
Table.Row = ChakraTable.Row;
Table.Header = ChakraTable.ColumnHeader;
Table.Cell = ChakraTable.Cell;
Table.Caption = ChakraTable.Caption;



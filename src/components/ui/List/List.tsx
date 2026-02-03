import { List as ChakraList, ListRootProps } from "@chakra-ui/react";

export const List = (props: ListRootProps) => {
  return <ChakraList.Root {...props} />;
};

List.Item = ChakraList.Item;
List.Indicator = ChakraList.Indicator;

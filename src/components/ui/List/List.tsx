import { ListRootProps } from "@chakra-ui/react";

import { StyledListRoot, StyledListItem, StyledListIndicator } from "./List.style";

export const List = (props: ListRootProps) => {
  return <StyledListRoot {...props} />;
};

List.Item = StyledListItem;
List.Indicator = StyledListIndicator;

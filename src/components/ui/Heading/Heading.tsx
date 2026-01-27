import { Heading as ChakraHeading, HeadingProps } from "@chakra-ui/react";
import { StyledHeading } from "./Heading.style";


export const Heading = (props: HeadingProps) => {
  return <StyledHeading {...props} />;
};

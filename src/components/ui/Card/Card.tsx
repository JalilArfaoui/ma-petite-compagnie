import {
  CardRoot as ChakraCard,
  CardHeader,
  CardBody,
  CardFooter,
  type CardRootProps,
} from "@chakra-ui/react";

export type CardProps = CardRootProps;

export const Card = (props: CardProps) => {
  return <ChakraCard {...props} />;
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

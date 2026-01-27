import { CardHeader, type CardRootProps } from "@chakra-ui/react";
import { StyledCard, StyledCardTitle, StyledCardBody } from "./Card.style";
import { Text } from "../Text/Text";

type CardProps = CardRootProps & {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

export const Card = ({ title, description, icon, children, ...props }: CardProps) => {
  return (
    <StyledCard {...props}>
      {icon && <CardHeader>{icon}</CardHeader>}
      <StyledCardBody>
        {title && <StyledCardTitle>{title}</StyledCardTitle>}
        {description && <Text>{description}</Text>}
        {children}
      </StyledCardBody>
    </StyledCard>
  );
};

Card.Header = CardHeader;
Card.Body = StyledCardBody;
Card.Title = StyledCardTitle;

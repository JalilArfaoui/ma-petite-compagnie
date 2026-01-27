import { type CardRootProps } from "@chakra-ui/react";
import {
  type IconColor,
  StyledCard,
  StyledCardTitle,
  StyledCardBody,
  StyledCardHeader,
} from "./Card.style";
import { Text } from "../Text/Text";

type CardProps = CardRootProps & {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  iconColor?: IconColor;
};

export const Card = ({ title, description, icon, iconColor, children, ...props }: CardProps) => {
  return (
    <StyledCard {...props}>
      {icon && <StyledCardHeader $iconColor={iconColor}>{icon}</StyledCardHeader>}
      <StyledCardBody>
        {title && <StyledCardTitle>{title}</StyledCardTitle>}
        {description && <Text>{description}</Text>}
        {children}
      </StyledCardBody>
    </StyledCard>
  );
};

Card.Header = StyledCardHeader;
Card.Body = StyledCardBody;
Card.Title = StyledCardTitle;

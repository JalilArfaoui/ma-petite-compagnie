import { ButtonProps } from "@chakra-ui/react";
import { StyledButton } from "./Button.style";

interface CustomButtonProps extends ButtonProps {
  icon?: React.ReactNode;
  iconSide?: "left" | "right";
}

export const Button = ({ icon, iconSide = "left", children, ...props }: CustomButtonProps) => {
  return (
    <StyledButton {...props}>
      {icon && iconSide === "left" && icon}
      {children}
      {icon && iconSide === "right" && icon}
    </StyledButton>
  );
};

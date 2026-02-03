import {
  AlertTitle,
  AlertDescription,
  AlertIndicator,
  type AlertRootProps,
} from "@chakra-ui/react";
import { StyledAlert } from "./Alert.style";

export type AlertProps = AlertRootProps;

export const Alert = (props: AlertProps) => {
  return <StyledAlert {...props} />;
};

Alert.Title = AlertTitle;
Alert.Description = AlertDescription;
Alert.Icon = AlertIndicator;

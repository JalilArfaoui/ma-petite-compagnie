import { AlertRoot as ChakraAlert, AlertTitle, AlertDescription, AlertIndicator, type AlertRootProps } from '@chakra-ui/react';

export type AlertProps = AlertRootProps;

export const Alert = (props: AlertProps) => {
  return <ChakraAlert {...props} />;
};

Alert.Title = AlertTitle;
Alert.Description = AlertDescription;
Alert.Icon = AlertIndicator;
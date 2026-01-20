import { Switch as ChakraSwitch, SwitchRootProps } from '@chakra-ui/react';

export interface SwitchProps extends SwitchRootProps {
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>
    rootRef?: React.Ref<HTMLLabelElement>
}

export const Switch = (props: SwitchProps) => {
  const { children, inputProps, rootRef, ...rest } = props;
  return (
    <ChakraSwitch.Root ref={rootRef} {...rest}>
      <ChakraSwitch.HiddenInput {...inputProps} />
      <ChakraSwitch.Control>
        <ChakraSwitch.Thumb />
      </ChakraSwitch.Control>
      {children && <ChakraSwitch.Label>{children}</ChakraSwitch.Label>}
    </ChakraSwitch.Root>
  );
};

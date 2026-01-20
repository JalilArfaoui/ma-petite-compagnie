import { RadioGroup as ChakraRadioGroup, type RadioGroupItemProps } from '@chakra-ui/react';
import * as React from 'react';

export interface RadioProps extends RadioGroupItemProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  rootRef?: React.Ref<HTMLDivElement>;
}

export const Radio = React.forwardRef<HTMLDivElement, RadioProps>(
  function Radio(props, ref) {
    const { children, inputProps, rootRef, ...rest } = props;
    return (
      <ChakraRadioGroup.Item ref={ref || rootRef} {...rest}>
        <ChakraRadioGroup.ItemHiddenInput {...inputProps} />
        <ChakraRadioGroup.ItemControl />
        {children && <ChakraRadioGroup.ItemText children={children} />}
      </ChakraRadioGroup.Item>
    );
  }
);

export const RadioGroup = ChakraRadioGroup.Root;

import { Select as ChakraSelect, SelectRootProps } from "@chakra-ui/react";

export const Select = (props: SelectRootProps) => {
  return <ChakraSelect.Root {...props} />;
};

Select.Trigger = ChakraSelect.Trigger;
Select.Content = ChakraSelect.Content;
Select.Item = ChakraSelect.Item;
Select.ItemText = ChakraSelect.ItemText;
Select.ValueText = ChakraSelect.ValueText;
Select.Label = ChakraSelect.Label;
Select.Control = ChakraSelect.Control;
Select.Positioner = ChakraSelect.Positioner;
Select.Indicator = ChakraSelect.Indicator;
Select.ClearTrigger = ChakraSelect.ClearTrigger;
Select.ItemGroup = ChakraSelect.ItemGroup;
Select.ItemGroupLabel = ChakraSelect.ItemGroupLabel;
Select.ItemIndicator = ChakraSelect.ItemIndicator;
Select.IndicatorGroup = ChakraSelect.IndicatorGroup;

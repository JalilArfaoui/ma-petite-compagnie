import {
  Popover as ChakraPopover,
  PopoverRootProps,
} from '@chakra-ui/react';

export const Popover = (props: PopoverRootProps) => {
  return <ChakraPopover.Root {...props} />;
};

Popover.Trigger = ChakraPopover.Trigger;
Popover.Content = ChakraPopover.Content;
Popover.Header = ChakraPopover.Header;
Popover.Body = ChakraPopover.Body;
Popover.Footer = ChakraPopover.Footer;
Popover.Arrow = ChakraPopover.Arrow;
Popover.CloseTrigger = ChakraPopover.CloseTrigger;
Popover.Anchor = ChakraPopover.Anchor;
Popover.Title = ChakraPopover.Title;
Popover.Description = ChakraPopover.Description;
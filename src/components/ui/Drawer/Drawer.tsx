import {
  DrawerRoot as ChakraDrawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerBackdrop,
  DrawerContent,
  DrawerCloseTrigger,
  type DrawerRootProps,
} from "@chakra-ui/react";

export const Drawer = (props: DrawerRootProps) => {
  return <ChakraDrawer {...props} />;
};

Drawer.Overlay = DrawerBackdrop;
Drawer.Content = DrawerContent;
Drawer.CloseButton = DrawerCloseTrigger;
Drawer.Header = DrawerHeader;
Drawer.Body = DrawerBody;
Drawer.Footer = DrawerFooter;

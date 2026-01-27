"use client";
import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";
import NextLink from "next/link";

interface CustomLinkProps extends LinkProps {
  href: string;
}

export const Link = ({ href, ...props }: CustomLinkProps) => {
  return <ChakraLink as={NextLink} href={href} {...props} />;
};

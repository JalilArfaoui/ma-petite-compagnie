"use client";
import { LinkProps } from "@chakra-ui/react";
import NextLink from "next/link";
import { StyledLink } from "./Link.style";

interface CustomLinkProps extends LinkProps {
  href: string;
}

export const Link = ({ href, ...props }: CustomLinkProps) => {
  return <StyledLink as={NextLink} href={href} {...props} />;
};

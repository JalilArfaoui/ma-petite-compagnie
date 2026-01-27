import { Button, Container, Link, Stack } from "@/components/ui";
import { LuTicket } from "react-icons/lu";
import { Link as RouterLink } from "@chakra-ui/react";
import { StyledHeader, LogoSection, TicketLogo, LogoText, NavLink } from "./Header.style";

export const Header = () => {
  return (
    <StyledHeader as="header">
      <Container maxW="container.xl">
        <Stack direction="row" align="center" justify="space-between">
          {/* Logo Section */}
          <RouterLink href="/" variant="plain" _hover={{ textDecoration: "none" }}>
            <LogoSection>
              <TicketLogo>
                <LuTicket size={28} />
              </TicketLogo>
              <LogoText as="h1">
                Ma petite
                <br />
                compagnie
              </LogoText>
            </LogoSection>
          </RouterLink>

          {/* Navigation Section */}
          <Stack direction="row" gap={10} ml={-20}>
            {["Production", "Planning", "Communication", "Administration"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`}>
                {item}
              </Link>
            ))}
          </Stack>

          {/* CTA Section */}
          <Button>Connexion</Button>
        </Stack>
      </Container>
    </StyledHeader>
  );
};

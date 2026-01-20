"use client"
import { Heading } from '@/components/ui/Heading/Heading';
import { Box } from '@/components/ui/Box/Box';
import { Container } from '@/components/ui/Container/Container';
import { Stack } from '@/components/ui/Stack/Stack';
import { Text } from '@/components/ui/Text/Text';

export default function Home() {
  return (
    <Container maxW="container.md" py={20}>
      <Stack gap={4} textAlign="center">
        <Heading as="h1" size="2xl">Ma Petite Compagnie</Heading>
        <Text fontSize="xl" color="gray.600">Application de gestion pour compagnie de théâtre</Text>
      </Stack>
    </Container>
  );
}

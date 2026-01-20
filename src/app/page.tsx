"use client"
import { Heading, Container, Stack, Text } from '@/components/ui';

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

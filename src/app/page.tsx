"use client";
import { Heading, Container, Stack, Text, Box, Button, Card } from "@/components/ui";
import { FaHome } from "react-icons/fa";

export default function Home() {
  return (
    <Box bg="#FFFBEF" border={"1px solid #f3eee3"}>
      <Container
        maxW="container.md"
        height="75vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        paddingTop={"400px"}
      >
        <Stack gap={4} textAlign="center">
          <Heading as="h1">Gérez votre troupe</Heading>
          <Heading as="h2" style={{ zIndex: "10" }}>
            sans faire de drame.
          </Heading>

          <span
            style={{
              backgroundColor: "#FFE8B4",
              height: "12px",
              width: "75em",
              borderRadius: "10px",
              marginTop: "-10px",
              zIndex: "0",
            }}
          ></span>

          <Text fontSize="3xl" color="gray.600">
            L&apos;outil tout-en-un pour les compagnies de théâtre, danse et arts de la rue.
            <br></br> Des répétitions à la première, tout est sous contrôle.
          </Text>

          <Box
            display={"flex"}
            style={{ marginTop: "80px", gap: "2em", flexWrap: "wrap", justifyContent: "center" }}
          >
            <Button w="320px" h="75px" fontSize={"25px"}>
              Lever le rideau
            </Button>
            <Button w="320px" h="75px" fontSize={"25px"} variant={"outline"}>
              Voir la bande annonce
            </Button>
          </Box>
        </Stack>

        <Box
          display={"flex"}
          style={{ marginTop: "80px", gap: "4em", flexWrap: "wrap", justifyContent: "center" }}
        >
          <Card
            w="320px"
            h="250px"
            title="Planning de répétition"
            description="Gérez les disponibilités de vos comédiens. Générez des feuilles de service claires."
            icon={<FaHome />}
            iconColor="red"
          />
          <Card
            w="320px"
            h="250px"
            title="Production & Décors"
            description="Suivez le budget costumes au centime près. Listez les accessoires pour la tournée."
            icon={<FaHome />}
            iconColor="yellow"
          />
          <Card
            w="320px"
            h="250px"
            title="Casting & Équipe"
            description="Centralisez mensurations et contacts. Un trombinoscope toujours à jour."
            icon={<FaHome />}
            iconColor="blue"
          />
        </Box>
      </Container>
    </Box>
  );
}

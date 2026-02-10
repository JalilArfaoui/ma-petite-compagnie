"use client";
import { Heading, Container, Stack, Text, Box, Button, Card } from "@/components/ui";
import { FaHome } from "react-icons/fa";

export default function Home() {
  return (
    <div className="bg-[#fffbef] min-h-screen font-serif">
      <section className="flex flex-col items-center pt-10 pb-20 text-center px-4">
        <Stack className="items-center w-full mx-auto">
          <Heading as="h1" className="relative z-10">
            Gérez votre troupe
          </Heading>
          <span className="relative inline-block z-10 -mt-10">
            <span className="absolute bottom-3 left-0 w-full h-4 bg-[#FFE8B4] opacity-80 -z-10 rounded-full scale-105"></span>
            <Heading as="h2">sans faire de drame.</Heading>
          </span>

          <Text className="text-xl md:text-2xl mt-5 leading-relaxed text-center">
            L&apos;outil tout-en-un pour les compagnies de théâtre, danse et arts de la rue.
            <br /> Des répétitions à la première, tout est sous contrôle.
          </Text>
        </Stack>
      </section>

      <section className="bg-white py-24">
        <Container maxW="max-w-7xl" className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full">
            <Card
              title="Planning de répétition"
              description="Gérez les disponibilités de vos comédiens. Générez des feuilles de service claires."
              icon={<FaHome />}
              iconColor="red"
            />
            <Card
              title="Production & Décors"
              description="Suivez le budget costumes au centime près. Listez les accessoires pour la tournée."
              icon={<FaHome />}
              iconColor="yellow"
            />
            <Card
              title="Casting & Équipe"
              description="Centralisez mensurations et contacts. Un trombinoscope toujours à jour."
              icon={<FaHome />}
              iconColor="blue"
            />
          </div>
        </Container>
      </section>
    </div>
  );
}

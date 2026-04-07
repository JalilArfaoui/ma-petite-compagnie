"use client";
import { Heading, Container, Stack, Text, Card } from "@/components/ui";
import { FaHome } from "react-icons/fa";

export default function Home() {
  return (
    <div className="bg-[#fffbef] min-h-screen font-serif">
      <section className="flex flex-col items-center pt-10 pb-20 text-center px-4">
        <Stack className="items-center w-full mx-auto">
          <Heading as="h1" className="relative z-10 xl:-mb-[70px] xs:max-sm:text-3xl sm:max-md:text-4xl md:max-lg:text-5xl lg:max-xl:text-6xl">
            Gérez votre troupe
          </Heading>
          <span className="relative inline-block z-10">
            <span className="absolute bottom-3 xs:max-lg:bottom-2 left-0 w-full h-5 xs:max-lg:h-3 lg:h-4 bg-[#FFE8B4] opacity-80 -z-10 rounded-full scale-105 xs:max-sm:scale-110 "></span>
            <Heading as="h2" className="xs:max-md:text-xl md:max-lg:text-4xl lg:max-xl:text-5xl">sans faire de drame.</Heading>
          </span>
          <Text className="break-words mt-2 sm:max-md:mt-4 md:mt-6 lg:mt-8 leading-relaxed text-center text-sm sm:text-sm md:text-base lg:text-lg xl:text-2xl xs:max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            L&apos;outil tout-en-un pour les compagnies de théâtre, danse et arts de la rue. Des répétitions à la première, tout est sous contrôle.
          </Text>
        </Stack>
      </section>

      <section className="bg-white py-24">
        <Container maxW="max-w-7xl" className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full">
            <Card
              title="Planning de répétition"
              description="Gérez les disponibilités de vos comédiens. Générez des feuilles de service claires."
              icon={<FaCalendar />}
              iconColor="red"
            />
            <Card
              title="Production & Décors"
              description="Suivez le budget costumes au centime près. Listez les accessoires pour la tournée."
              icon={<FaSplotch />}
              iconColor="yellow"
            />
            <Card
              title="Casting & Équipe"
              description="Centralisez mensurations et contacts. Un trombinoscope toujours à jour."
              icon={<FaUsers />}
              iconColor="blue"
            />
          </div>
        </Container>
      </section>
    </div>
  );
}

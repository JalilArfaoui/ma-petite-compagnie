import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { Container, Logo, Text } from "@/components/ui";

export const Footer = () => {
  return (
    <footer className="w-full bg-bg-hover py-12">
      <Container className="flex flex-col items-center gap-6">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Logo size={24} />
          <h2 className="text-xl font-bold text-black font-serif">Ma petite Compagnie</h2>
        </Link>

        {/* Copyright & Made with Love */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Text className="text-xs text-text-secondary font-sans">
            © 2026 Ma petite Compagnie. Tous droits réservés
          </Text>
          <Text className="text-sm font-bold text-text-secondary flex items-center gap-1 font-serif">
            Fait avec <span className="text-red-500">❤️</span> à Albi
          </Text>
        </div>

        {/* Github Link */}
        <Link
          href="https://github.com/JalilArfaoui/ma-petite-compagnie"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-primary hover:text-primary transition-colors"
        >
          <FaGithub size={24} />
        </Link>

        {/* Footer Links */}
        <div className="flex items-center gap-8 mt-4">
          {["Confidentialité", "CGU", "Support"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-sm font-bold text-text-secondary hover:text-primary transition-colors font-serif"
            >
              {item}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
};

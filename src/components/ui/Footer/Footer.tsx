"use client";

import Link from "next/link";
import { LuTicket } from "react-icons/lu";
import { FaGithub } from "react-icons/fa6";
import { Container, Text } from "@/components/ui";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#F9FAFC] py-12">
      <Container className="flex flex-col items-center gap-6">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center p-2 rounded-lg bg-[#ffe3e7] text-[#D00039] -rotate-6 transform shadow-sm">
            <LuTicket size={24} />
          </div>
          <h2 className="text-xl font-bold text-black font-serif">Ma petite Compagnie</h2>
        </Link>

        {/* Copyright & Made with Love */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Text className="text-xs text-[#526379] font-sans">
            © 2026 Ma petite Compagnie. Tous droits réservés
          </Text>
          <Text className="text-sm font-bold text-[#526379] flex items-center gap-1 font-serif">
            Fait avec <span className="text-red-500">❤️</span> à Albi
          </Text>
        </div>

        {/* Github Link */}
        <Link
          href="https://github.com/JalilArfaoui/ma-petite-compagnie"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#43566b] hover:text-[#D00039] transition-colors"
        >
          <FaGithub size={24} />
        </Link>

        {/* Footer Links */}
        <div className="flex items-center gap-8 mt-4">
          {["Confidentialité", "CGU", "Support"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-sm font-bold text-[#526379] hover:text-[#D00039] transition-colors font-serif"
            >
              {item}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
};

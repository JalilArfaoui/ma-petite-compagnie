"use client";

import { Heading, Link } from "@/components/ui";

export default function CommunicationPage() {
  return (
    <Heading>
      Page communication <br />

      <Link href="/communication/contact">
        Créé un contact
      </Link>

      <br />

      <Link href="/communication/email">
        Envoyé un email
      </Link>
    </Heading>
  );
}
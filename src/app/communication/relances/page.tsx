"use client";
import { useEffect, useState } from "react";
import { Contact, Tag } from "@prisma/client";
import { Box, Button, Heading, Link, Stack, Text } from "@/components/ui";
import { Toaster, toaster } from "@/components/ui/Toast/toaster";
import { listerContactsARelancer } from "../api/contact/contact";
import { TagBadge } from "../components/TagBadge";
import { IoAlarmOutline, IoPersonOutline } from "react-icons/io5";

type ContactAvecTags = Contact & { tags: Tag[] };

/** Retourne la classe CSS de couleur selon l'urgence de la relance. */
function classeUrgence(date: Date): string {
  const maintenant = new Date();
  const diffJours = Math.ceil(
    (date.getTime() - maintenant.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffJours < 0) return "border-l-4 border-red-400 bg-red-50";
  if (diffJours <= 7) return "border-l-4 border-amber-400 bg-amber-50";
  return "border-l-4 border-green-400 bg-green-50";
}

function badgeUrgence(date: Date) {
  const maintenant = new Date();
  const diffJours = Math.ceil(
    (date.getTime() - maintenant.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffJours < 0)
    return <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">En retard de {Math.abs(diffJours)} j</span>;
  if (diffJours === 0)
    return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Aujourd&apos;hui</span>;
  if (diffJours <= 7)
    return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Dans {diffJours} j</span>;
  return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Dans {diffJours} j</span>;
}

export default function RelancesPage() {
  const [contacts, setContacts] = useState<ContactAvecTags[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    async function charger() {
      const r = await listerContactsARelancer();
      if (r.succes && r.donnee) {
        setContacts(r.donnee as ContactAvecTags[]);
      } else {
        toaster.create({ description: r.message, type: "error" });
      }
      setChargement(false);
    }
    charger();
  }, []);

  const enRetard = contacts.filter(
    (c) => c.date_relance && new Date(c.date_relance) < new Date()
  );
  const aVenir = contacts.filter(
    (c) => c.date_relance && new Date(c.date_relance) >= new Date()
  );

  return (
    <Box className="py-5 px-3">
      <Toaster />

      <Stack direction="row" justify="between" className="items-center mb-6">
        <Stack direction="row" gap={2} className="items-center">
          <IoAlarmOutline className="w-6 h-6 text-amber-500" />
          <Heading as="h3">Suivi des relances</Heading>
        </Stack>
        <Link href="/communication">
          <Button size="sm" variant="outline">
            Retour aux contacts
          </Button>
        </Link>
      </Stack>

      {chargement ? (
        <Text className="text-slate-400 italic">Chargement...</Text>
      ) : contacts.length === 0 ? (
        <Box className="text-center py-16">
          <IoAlarmOutline className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <Text className="text-slate-400 text-lg">Aucune relance planifiée.</Text>
          <Text className="text-slate-400 text-sm mt-1">
            Ouvrez une fiche contact pour en planifier une.
          </Text>
        </Box>
      ) : (
        <Stack gap={6}>
          {/* Section En retard */}
          {enRetard.length > 0 && (
            <Box>
              <Text className="font-bold text-red-600 mb-2 uppercase text-xs tracking-wider">
                En retard ({enRetard.length})
              </Text>
              <Stack gap={2}>
                {enRetard.map((c) => (
                  <CarteRelance key={c.id} contact={c} />
                ))}
              </Stack>
            </Box>
          )}

          {/* Section À venir */}
          {aVenir.length > 0 && (
            <Box>
              <Text className="font-bold text-slate-500 mb-2 uppercase text-xs tracking-wider">
                À venir ({aVenir.length})
              </Text>
              <Stack gap={2}>
                {aVenir.map((c) => (
                  <CarteRelance key={c.id} contact={c} />
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      )}
    </Box>
  );
}

function CarteRelance({ contact }: { contact: ContactAvecTags }) {
  const date = new Date(contact.date_relance!);
  return (
    <Box
      className={`rounded-lg p-4 ${classeUrgence(date)} flex gap-4 items-start`}
    >
      {/* Avatar */}
      <Box className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
        <IoPersonOutline className="w-5 h-5" />
      </Box>

      {/* Infos */}
      <Box className="flex-1 min-w-0">
        <Stack direction="row" justify="between" className="flex-wrap gap-1">
          <Link href={`/communication/${contact.id}`}>
            <Text className="font-semibold hover:underline">
              {contact.prenom} {contact.nom}
            </Text>
          </Link>
          {badgeUrgence(date)}
        </Stack>

        <Text className="text-xs text-slate-500 mt-0.5">
          {date.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>

        {contact.note_relance && (
          <Text className="text-sm text-slate-600 mt-1 italic">
            &ldquo;{contact.note_relance}&rdquo;
          </Text>
        )}

        {/* Tags */}
        {contact.tags.length > 0 && (
          <Stack direction="row" gap={1} className="flex-wrap mt-2">
            {contact.tags.map((t) => (
              <TagBadge key={t.id} tag={t} />
            ))}
          </Stack>
        )}

        {/* Infos contact */}
        <Text className="text-xs text-slate-400 mt-1">
          {contact.role ?? "Rôle non défini"}
          {contact.email ? ` · ${contact.email}` : ""}
          {contact.tel ? ` · ${contact.tel}` : ""}
        </Text>
      </Box>
    </Box>
  );
}

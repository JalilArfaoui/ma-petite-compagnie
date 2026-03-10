import { BrevoClient } from "@getbrevo/brevo";

export function get_Brevo_Client() {
  if (!process.env.BREVO_API_KEY) {
    console.warn(
      "La clé API est mauvaise. La synchronisation avec Brevo n'a pas pu être effectué."
    );
    return null;
  }

  return new BrevoClient({ apiKey: process.env.BREVO_API_KEY });
}

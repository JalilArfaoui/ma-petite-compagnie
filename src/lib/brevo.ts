import { BrevoClient } from "@getbrevo/brevo";

export function get_Brevo_Client() {
  if (!process.env.BREVO_API_KEY) {
    console.warn("maivaise key, pas sync Brevo");
    return null;
  }

  return new BrevoClient({ apiKey: process.env.BREVO_API_KEY });
}
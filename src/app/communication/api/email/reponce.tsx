import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { destinataire, sujet, message } = await req.json();

    const reponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: {
          name: "Mon petite Company",
          email: "contact@tonsite.fr",
        },
        to: [{ email: destinataire }],
        subject: sujet,
        htmlContent: `<p>${message}</p>`,
      }),
    });

    if (!reponse.ok) {
      const erreur = await reponse.text();
      return NextResponse.json({ erreur }, { status: 500 });
    }

    return NextResponse.json({ succes: true });
  } catch (erreur) {
    return NextResponse.json(
      { erreur: "Erreur serveur" },
      { status: 500 }
    );
  }
}
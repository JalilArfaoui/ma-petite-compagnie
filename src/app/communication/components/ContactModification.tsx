"use client";
import { Contact } from "@prisma/client";
import { useState } from "react";
import { getOrReplace } from "../util/typeUtility";

function ContactModification({
  onSubmitted,
  contactDonnee,
}: {
  onSubmitted: (donneeFormulaire: FormData) => void;
  contactDonnee: Contact | null;
}) {
  const [nom, setNom] = useState(getOrReplace(contactDonnee?.nom, ""));
  const [prenom, setPrenom] = useState(getOrReplace(contactDonnee?.prenom, ""));
  const [email, setEmail] = useState(getOrReplace(contactDonnee?.email, ""));
  const [tel, setTel] = useState(getOrReplace(contactDonnee?.tel, ""));
  const [role, setRole] = useState(getOrReplace(contactDonnee?.role, "USER"));
  return (
    <>
      <div>
        <form action={onSubmitted}>
          <label>
            Nom : <input name="nom" onChange={(e) => setNom(e.target.value)} value={nom} />
          </label>
          <label>
            Prenom :{" "}
            <input name="prenom" onChange={(e) => setPrenom(e.target.value)} value={prenom} />
          </label>
          <label>
            Email : <input name="email" onChange={(e) => setEmail(e.target.value)} value={email} />
          </label>
          <label>
            Téléphone : <input name="tel" onChange={(e) => setTel(e.target.value)} value={tel} />
          </label>
          <p>
            Rôles
            <label>
              Utilisateur :{" "}
              <input
                type="radio"
                name="role"
                value="USER"
                onChange={() => setRole("USER")}
                checked={role === "USER"}
              />
            </label>
            <label>
              Partenaire :
              <input
                type="radio"
                name="role"
                value="PARTENAIRE"
                onChange={() => setRole("PARTENAIRE")}
                checked={role === "PARTENAIRE"}
              />
            </label>
          </p>
          <button type="submit">Confirmer</button>
        </form>
      </div>
    </>
  );
}

export default ContactModification;

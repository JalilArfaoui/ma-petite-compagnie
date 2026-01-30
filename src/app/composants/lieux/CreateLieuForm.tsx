"use client"
import type { Lieu } from "@/types/lieu"
import {useState} from "react";

type Props = {
    onSuccess: (lieu: Lieu) => void
    onCancel: () => void
}
export function CreateLieuForm({ onSuccess, onCancel }: Props) {
    const [libelle, setLibelle] = useState("")
    const [adresse, setAdresse] = useState("")
    const [ville, setVille] = useState("")
    const [numeroSalle, setNumeroSalle] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const res = await fetch("/api/lieux", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ libelle, adresse, ville, numeroSalle}),
        })

        if (!res.ok) {
            // TODO la gestion d'erreur
            return
        }

        const lieu: Lieu = await res.json()

        onSuccess(lieu)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor={"libelle"}>Nom</label>
                <input
                    id={"libelle"}
                    type="text"
                    placeholder={"Opéra National du Capitole"}
                    value={libelle}
                    onChange={(e) => setLibelle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor={"adresse"}>Adresse</label>
                <input
                    id={"adresse"}
                    type="text"
                    placeholder={"Pl. du Capitole"}
                    value={adresse}
                    onChange={(e)=>setAdresse(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor={"ville"}>Ville</label>
                <input
                    id={"ville"}
                    type="text"
                    placeholder={"Toulouse"}
                    value={ville}
                    onChange={(e)=>setVille(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor={"numeroSalle"}>Numéro de salle</label>
            <input
                id={"numeroSalle"}
                type="text"
                value={numeroSalle}
                onChange={(e)=>setNumeroSalle(e.target.value)}
            />
            </div>
            <button type="submit" disabled={!libelle || !adresse || !ville}>Créer</button>

            <button type="button" onClick={onCancel}>
                Annuler
            </button>
        </form>
    )
}
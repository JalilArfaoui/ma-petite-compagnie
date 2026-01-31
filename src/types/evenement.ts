type Evenement = {
    id: number
    nom: string
    compagnieId: number
    lieuId: number
    categorieId: number
    dateDebut: string
    dateFin: string
    participants: any[] // TODO créer le type utilisateur
}
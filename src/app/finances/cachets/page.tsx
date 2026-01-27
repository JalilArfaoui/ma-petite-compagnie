'use client'

import { useState } from 'react'
import styles from './page.module.css'

type Cachet = {
  id: number
  date: string
  nombre: number
  categorie : string
  note?: string
}

export default function PageCachets() {
  const [cachets, setCachets] = useState<Cachet[]>([])
  const [date, setDate] = useState('')
  const [nombre, setNombre] = useState(1)
  const [categorie, setCategorie] = useState('')
  const [note, setNote] = useState('')

  function ajouterCachet(e: React.FormEvent) {
    e.preventDefault()

    if (!date) return

    const nouveauCachet: Cachet = {
      id: Date.now(),
      date,
      nombre,
      categorie,
      note,
    }

    setCachets([...cachets, nouveauCachet])
    setDate('')
    setNombre(1)
    setCategorie('')
    setNote('')
  }

  function supprimerCachet(id: number) {
    setCachets(cachets.filter(c => c.id !== id))
  }

  const totalCachets = cachets.reduce((acc, c) => acc + c.nombre, 0)

  return (
    <main className={styles.container}>
      <h1>Gestion des cachets</h1>

      <form onSubmit={ajouterCachet} style={{ marginBottom: 24 }}>
        <div>
          <label>Date</label><br/>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        <div>
            <label>Nombre de cachets</label><br/>
            <input type="number" min={1} value={nombre} onChange={e => setNombre(Number(e.target.value))}/>
        </div>

        <div>
          <label htmlFor="categorie">Catégorie</label><br />
          <select
            id="categorie"
            value={categorie}
            onChange={e => setCategorie(e.target.value)}
          >
            <option value="">— Choisir une catégorie —</option>
            <option value="cachet">Cachet</option>
            <option value="consultation">Consultation</option>
            <option value="repetition">Répétition</option>
            <option value="formation">Formation</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <div>
          <label>Note</label><br/>
          <input value={note} onChange={e => setNote(e.target.value)} />
        </div>

        <button type="submit" style={{ marginTop: 12 }}>
          Ajouter
        </button>
      </form>

      <h2>Cachets enregistrés</h2>

      <ul className={styles.list}>
        {cachets.map(c => (
          <li key={c.id} className={styles.item}>
            <div className={styles.main}>
              <span className={styles.date}>{c.date}</span>
              <span className={styles.category}>{c.categorie || 'Sans catégorie'}</span>
              <span className={styles.quantity}>{c.nombre} cachet(s)</span>
            </div>

            {c.note && (
              <div className={styles.note}>{c.note}</div>
            )}

            <button
              className={styles.delete}
              onClick={() => supprimerCachet(c.id)}
              aria-label="Supprimer"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <p>
        <strong>Total :</strong> {totalCachets} cachets
      </p>
    </main>
  )
}
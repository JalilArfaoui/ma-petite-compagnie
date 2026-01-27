'use client'

import { useState } from 'react'
import styles from './page.module.css'

type Cachet = {
  id: number
  date: string
  nombre: number
  note?: string
}

export default function PageCachets() {
  const [cachets, setCachets] = useState<Cachet[]>([])
  const [date, setDate] = useState('')
  const [nombre, setNombre] = useState(1)
  const [note, setNote] = useState('')

  function ajouterCachet(e: React.FormEvent) {
    e.preventDefault()

    if (!date) return

    const nouveauCachet: Cachet = {
      id: Date.now(),
      date,
      nombre,
      note,
    }

    setCachets([...cachets, nouveauCachet])
    setDate('')
    setNombre(1)
    setNote('')
  }

  function supprimerCachet(id: number) {
    setCachets(cachets.filter(c => c.id !== id))
  }

  const totalCachets = cachets.reduce((acc, c) => acc + c.nombre, 0)

  return (
    <main className={styles.container} style={{ padding: 90, maxWidth: 600 }}>
      <h1>Gestion des cachets</h1>

      <form onSubmit={ajouterCachet} style={{ marginBottom: 24 }}>
        <div>
          <label>Date</label><br />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        <div>
            <label>Nombre de cachets</label><br />
            <input type="number" min={1} value={nombre} onChange={e => setNombre(Number(e.target.value))}/>
        </div>

        <div>
          <label>Note</label><br />
          <input value={note} onChange={e => setNote(e.target.value)} />
        </div>

        <button type="submit" style={{ marginTop: 12 }}>
          Ajouter
        </button>
      </form>

      <h2>Cachets enregistrés</h2>

      <ul>
        {cachets.map(c => (
          <li key={c.id}>
            {c.date} — {c.nombre} cachet(s)
            {c.note && ` (${c.note})`}
            <button onClick={() => supprimerCachet(c.id)} style={{ marginLeft: 8 }}>
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
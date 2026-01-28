import Calendar from "./components/calendar/calendar";

const yearInMS = 31536000000;

export default function PlanningPage() {
  return (
    <div>
      <Calendar events={
        [
  {
    id: 1,
    nom: "Tech Conference 2026",
    compagnieId: 101,
    lieuId: 201,
    categorieId: 1,
    dateDebut: 1736503200000 + yearInMS, // Jan 10, 2026 09:00:00
    dateFin: 1736535600000 + yearInMS    // Jan 10, 2026 18:00:00
  },
  {
    id: 2,
    nom: "Business Networking Event",
    compagnieId: 102,
    lieuId: 202,
    categorieId: 2,
    dateDebut: 1736967600000 + yearInMS, // Jan 15, 2026 18:00:00
    dateFin: 1736982000000 + yearInMS    // Jan 15, 2026 22:00:00
  },
  {
    id: 3,
    nom: "Product Launch: Smart Home System",
    compagnieId: 103,
    lieuId: 203,
    categorieId: 3,
    dateDebut: 1737198000000 + yearInMS, // Jan 18, 2026 10:00:00
    dateFin: 1737212400000 + yearInMS    // Jan 18, 2026 14:00:00
  },
  {
    id: 4,
    nom: "DevOps Workshop",
    compagnieId: 104,
    lieuId: 204,
    categorieId: 1,
    dateDebut: 1737709200000 + yearInMS, // Jan 24, 2026 08:00:00
    dateFin: 1737745200000 + yearInMS    // Jan 24, 2026 18:00:00
  },
  {
    id: 5,
    nom: "Annual Industry Summit",
    compagnieId: 105,
    lieuId: 205,
    categorieId: 2,
    dateDebut: 1737885600000 + yearInMS, // Jan 26, 2026 09:00:00
    dateFin: 1738087200000 + yearInMS    // Jan 28, 2026 17:00:00
  },
  {
    id: 6,
    nom: "Cloud Infrastructure Seminar",
    compagnieId: 106,
    lieuId: 206,
    categorieId: 1,
    dateDebut: 1738231200000 + yearInMS, // Jan 30, 2026 09:00:00
    dateFin: 1738342800000 + yearInMS    // Jan 31, 2026 16:00:00
  },
  {
    id: 7,
    nom: "Startup Pitch Night",
    compagnieId: 107,
    lieuId: 207,
    categorieId: 2,
    dateDebut: 1736294400000 + yearInMS, // Jan 8, 2026 19:00:00
    dateFin: 1736305200000 + yearInMS    // Jan 8, 2026 22:00:00
  },
  {
    id: 8,
    nom: "Cybersecurity Training",
    compagnieId: 108,
    lieuId: 208,
    categorieId: 1,
    dateDebut: 1737464400000 + yearInMS, // Jan 21, 2026 13:00:00
    dateFin: 1737482400000 + yearInMS    // Jan 21, 2026 18:00:00
  },
  {
    id: 9,
    nom: "Cybersecurity Training 2",
    compagnieId: 108,
    lieuId: 208,
    categorieId: 1,
    dateDebut: 1737464400000 + yearInMS, // Jan 21, 2026 13:00:00
    dateFin: 1737482400000 + yearInMS    // Jan 21, 2026 18:00:00
  }
]
      } />
    </div>
  );
}



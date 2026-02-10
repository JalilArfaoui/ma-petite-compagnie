import { Evenement } from "@prisma/client";

const isEventOnDay = (event: Evenement, dayTimestamp: number): boolean => {
    const dayStart = new Date(dayTimestamp).setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayTimestamp).setHours(23, 59, 59, 999);
    
    return (new Date(event.dateDebut).getTime() >= dayStart && new Date(event.dateDebut).getTime() <= dayEnd) || (
        new Date(event.dateFin).getTime() >= dayStart && new Date(event.dateFin).getTime() <= dayEnd
    ) || (
        new Date(event.dateDebut).getTime() <= dayStart && new Date(event.dateFin).getTime() >= dayEnd
    )
};

export default isEventOnDay;
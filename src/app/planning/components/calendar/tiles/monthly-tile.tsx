<<<<<<< HEAD
import { Evenement } from "../calendar";
import isToday from "../methods/isToday";
=======
import { Evenement } from "@prisma/client";
import isToday from "../methods/isToday";
import { CalendarDay } from "../calendar";
>>>>>>> b78cfb5f285e18054aef1a7b0a7cf0751d66eb7e


export default function MonthlyTile({
    calDay,
    index,
    viewType,
    onEventClick,
    slotHeight,
} : {
<<<<<<< HEAD
    calDay: { day: number; month: number; year: number; isCurrentMonth: boolean; events: Evenement[] },
=======
    calDay: CalendarDay,
>>>>>>> b78cfb5f285e18054aef1a7b0a7cf0751d66eb7e
    index: number,
    onEventClick?: (event: Evenement) => void,
    viewType: 'monthly' | 'weekly',
    slotHeight?: number
}) {

<<<<<<< HEAD
    /*

        La hauteur d'un jour correspond à 100%.
        L'idée est de placer les évènements, lorsqu'ils la viewType='weekly', de façon absolue en fonction de leur heure de début et de fin.
        Par exemple, un évènement qui commence à 9h00 et finit à 11h00 occupera une hauteur de (2/24)*100% = 8.33%,
        et sera positionné à partir de (9/24)*100% = 37.5% du haut du conteneur du jour.
        Pour référénce, on tiendra compte des données suivantes:
        - La hauteur du header du jour (numéro du jour) : 50px
        - La hauteur d'une tile de créneau horaire : 35.6px

    */

=======
>>>>>>> b78cfb5f285e18054aef1a7b0a7cf0751d66eb7e
    

    return (
        <div
            key={index}
            className={`calendar-day ${!calDay.isCurrentMonth ? `other-${viewType}` : ''} ${isToday(calDay) ? 'today' : ''}`}
            style={{
                borderRight: (index + 1) % 7 === 0 ? 'none' : "2px solid #e0e0e0",
            }}
        >
            <div className="day-number">{calDay.day}</div>


            <div className="events-container">
                {calDay.events.slice(0, 3).map(event => {
                    const hourStart = new Date(event.dateDebut).getHours();
                    const hourEnd = new Date(event.dateFin).getHours();
                    return (
                        <div
                            key={event.id}
                            className="event-tile"
                            onClick={() => onEventClick?.(event)}
                            title={event.nom}

                            style={{
                                position: viewType === 'weekly' ? 'absolute' : 'relative',
                                top: viewType === 'weekly' ? `calc(50px + ${(hourStart) * (slotHeight || 35.6)}px)` : 'auto',
                                height: viewType === 'weekly' ? `calc(${(hourEnd - hourStart) * (slotHeight || 35.6)}px)` : 'auto',
                            }}
                        >
                            <span className="event-time">
                                {new Date(event.dateDebut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.dateFin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="event-name">{event.nom}</span>
                        </div>
                    )
                })}
                    {calDay.events.length > 3 && (
                    <div className="more-events">
                    +{calDay.events.length - 3} more
                    </div>
                )}
            </div>
        </div>
    )
}
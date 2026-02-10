import { Evenement } from "@prisma/client";
import isToday from "../methods/isToday";
import { CalendarDay } from "../calendar";


export default function MonthlyTile({
    calDay,
    index,
    viewType,
    onEventClick,
    slotHeight,
} : {
    calDay: CalendarDay,
    index: number,
    onEventClick?: (event: Evenement) => void,
    viewType: 'monthly' | 'weekly',
    slotHeight?: number
}) {

    

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
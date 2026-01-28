import { Evenement } from "../calendar";
import isToday from "../methods/isToday";


export default function MonthlyTile({
    calDay,
    index,
    viewType,
    onEventClick,
} : {
    calDay: { day: number; month: number; year: number; isCurrentMonth: boolean; events: Evenement[] },
    index: number,
    onEventClick?: (event: Evenement) => void,
    viewType: 'monthly' | 'weekly',
}) {
    return (
        <div
        key={index}
        className={`calendar-day ${!calDay.isCurrentMonth ? `other-${viewType}` : ''} ${isToday(calDay) ? 'today' : ''}`}
        >
            <div className="day-number">{calDay.day}</div>

            <div className="events-container">
                {calDay.events.slice(0, 3).map(event => (
                    <div
                        key={event.id}
                        className="event-tile"
                        onClick={() => onEventClick?.(event)}
                        title={event.nom}
                    >
                     <span className="event-name">{event.nom}</span>
                    </div>
                ))}
                    {calDay.events.length > 3 && (
                    <div className="more-events">
                    +{calDay.events.length - 3} more
                    </div>
                )}
            </div>
        </div>
    )
}
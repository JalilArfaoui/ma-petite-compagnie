import isToday from "../methods/isToday";
import { CalendarDay, EvenementBuiltInt } from "../calendar";
import { placerEvenementsEnColonne } from "./placerEvenementsEnColonne";

export type PositionedEvent = {
  event: EvenementBuiltInt;
  startMinutes: number;
  endMinutes: number;
  column: number;
  columnsCount: number;
};

export default function CalendarTile({
  calDay,
  index,
  viewType,
  onEventClick,
  slotHeight,
}: {
  calDay: CalendarDay;
  index: number;
  onEventClick?: (event: EvenementBuiltInt) => void;
  viewType: "monthly" | "weekly";
  slotHeight?: number;
}) {
  const formatEventRange = (event: EvenementBuiltInt) => {
    const start = new Date(event.dateDebut);
    const end = new Date(event.dateFin);
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    const dayDiff = Math.max(Math.round((endDay - startDay) / (24 * 60 * 60 * 1000)), 0);

    const hourLabel = (date: Date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      if (minutes === 0) return `${hours}h`;
      return `${hours}h${String(minutes).padStart(2, "0")}`;
    };

    const overlapSuffix = viewType === "weekly" && dayDiff > 0 ? ` +${dayDiff}` : "";
    return `${hourLabel(start)} - ${hourLabel(end)}${overlapSuffix}`;
  };

  const weeklyEvents: PositionedEvent[] = placerEvenementsEnColonne(viewType, calDay);


  return (
    <div
      key={index}
      className={`calendar-day ${!calDay.isCurrentMonth ? `other-${viewType}` : ""} ${isToday(calDay) ? "today" : ""}`}
      style={{
        borderRight: (index + 1) % 7 === 0 ? "none" : "2px solid #e0e0e0",
      }}
    >
      <div className="day-number">{calDay.day}</div>

      <div className="events-container">
        {(viewType === "weekly"
          ? weeklyEvents
          : calDay.events.map((event: EvenementBuiltInt) => ({ event }))
        ).map((item: PositionedEvent | { event: EvenementBuiltInt }) => {
          const event = item.event;
          const topInMinutes =
            viewType === "weekly" && "startMinutes" in item ? item.startMinutes : 0;
          const durationInMinutes =
            viewType === "weekly" && "endMinutes" in item
              ? Math.max(item.endMinutes - item.startMinutes, 15)
              : 0;
          const column = viewType === "weekly" && "column" in item ? (item.column ?? 0) : 0;
          const columnsCount =
            viewType === "weekly" && "columnsCount" in item ? (item.columnsCount ?? 1) : 1;
          const widthPercent = 100 / columnsCount;
          const leftPercent = column * widthPercent;

          return (
            <div
              key={event.id}
              className="event-tile"
              onClick={() =>
                onEventClick?.({ ...event, dateDebut: event.dateDebut, dateFin: event.dateFin })
              }
              title={event.nom}
              style={{
                position: viewType === "weekly" ? "absolute" : "relative",
                top:
                  viewType === "weekly"
                    ? `${(topInMinutes / 60) * (slotHeight || 35.6)}px`
                    : "auto",
                height:
                  viewType === "weekly"
                    ? `${(durationInMinutes / 60) * (slotHeight || 35.6)}px`
                    : "auto",
                left: viewType === "weekly" ? `calc(${leftPercent}% + 4px)` : undefined,
                right: viewType === "weekly" ? "auto" : undefined,
                width: viewType === "weekly" ? `calc(${widthPercent}% - 8px)` : undefined,
              }}
            >
              <span className="event-dot" aria-hidden="true" />
              <span className="event-content">
                <span className="event-time">{formatEventRange(event)}</span>
                <span className="event-name">{event.nom}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
